import * as tf from '@tensorflow/tfjs-node';
import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const IMAGE_SIZE = 224;

interface CatDetails {
  reporter: string;
  imageUrl: string;
  date: string;
}

// Load pre-trained MobileNet model
const loadModel = async () => {
  return await tf.loadGraphModel('https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/2', { fromTFHub: true });
};

// Download and preprocess image from URL
const preprocessImage = async (imageUrl: string) => {
  try {
    const response = await axios.get(imageUrl);
    const imgBuffer = Buffer.from(response.data, 'binary');
    const img = await loadImage(imgBuffer);
    const canvas = createCanvas(IMAGE_SIZE, IMAGE_SIZE);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
    const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE) as ImageData;
  
    const imgTensor = tf.browser.fromPixels(imageData)
      .toFloat()
      .div(tf.scalar(127))
      .sub(tf.scalar(1))
      .expandDims();
  
    return imgTensor;
  } catch (error: unknown) {
    console.error(JSON.stringify({
      trace: 'preprocessImage',
      error,
    }));
  }
};

// Extract features using MobileNet
const extractFeatures = async (imageUrl: string, model: tf.GraphModel) => {
  const imgTensor = await preprocessImage(imageUrl);
  if (!imgTensor) {
    console.error('imgTensor is undefined');
    return;
  }

  const predictions = model.predict(imgTensor) as tf.Tensor;
  return predictions.flatten().arraySync();
};

// Compute cosine similarity between two feature vectors
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((acc, val, idx) => acc + val * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Match images
const matchImages = async (userImageUrl: string, foundCats: CatDetails[]) => {
  const model = await loadModel();
  const userFeatures = await extractFeatures(userImageUrl, model);
  if (!userFeatures) {
    console.error('userFeatures is undefined');
    return;
  }
  const similarities = await Promise.all(foundCats.map(async (cat) => {
    const features = await extractFeatures(cat.imageUrl, model);
    if (!features) {
      console.error('features is undefined');
      return;
    }
    return { ...cat, similarity: cosineSimilarity(userFeatures, features) };
  }));

  return similarities;
};

// Example usage
const userImageUrl = 'https://d1xo1ei89o6wi.cloudfront.net/photos/pet/47198368/28f92db2-5547-447c-9392-d02dc13852ed.jpeg?width=640&format=webp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const binFolderPath = path.resolve(__dirname, '../../bin');
const dataFilePath = path.join(binFolderPath, 'scrapedCats.json');

// Ensure the data file exists
if (!fs.existsSync(dataFilePath)) {
  console.error('Error: Data file not found.');
  process.exit(1);
}

const scrapedData: CatDetails[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

const saveDataToFile = (data: CatDetails[], filePath: string) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
  console.log(`Data saved to ${filePath}`);
};

const outputFilePath = path.join(binFolderPath, 'matchedCats.json');

matchImages(userImageUrl, scrapedData).then(matches => {
  if (!matches) {
    return;
  }

  if (matches.some((el) => el === undefined)) {
    return;
  }

  const validMatches = matches as CatDetails[];

  saveDataToFile(validMatches, outputFilePath);
  console.log('Matches:', matches);
}).catch(err => {
  console.error('Error:', err);
});

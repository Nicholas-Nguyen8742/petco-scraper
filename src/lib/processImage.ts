// import * as tf from '@tensorflow/tfjs-node';
// import { createCanvas, loadImage } from 'canvas';
// import axios from 'axios';

// const IMAGE_SIZE = 224;

// // Load pre-trained MobileNet model
// const loadModel = async () => {
//   return await tf.loadGraphModel('https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_140_224/classification/4', { fromTFHub: true });
// };

// const preprocessImage = async (imageUrl: string) => {
//   const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//   const imgBuffer = Buffer.from(response.data, 'binary');
//   const img = await loadImage(imgBuffer);
//   const canvas = createCanvas(IMAGE_SIZE, IMAGE_SIZE);
//   const ctx = canvas.getContext('2d');
//   ctx.drawImage(img, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
//   const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE) as ImageData;

//   const imgTensor = tf.browser.fromPixels(imageData)
//     .toFloat()
//     .div(tf.scalar(127))
//     .sub(tf.scalar(1))
//     .expandDims();

//   return imgTensor;
// };

// const extractFeatures = async (imageUrl: string, model: tf.GraphModel) => {
//   const imgTensor = await preprocessImage(imageUrl);
//   const predictions = model.predict(imgTensor) as tf.Tensor;
//   return predictions.flatten().arraySync();
// };

// export {
//   loadModel,
//   preprocessImage,
//   extractFeatures,
// }

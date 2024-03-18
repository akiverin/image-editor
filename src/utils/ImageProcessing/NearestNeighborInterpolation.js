export default function nearestNeighborInterpolation(imageData, newWidth, newHeight) {
    const { width, height, data } = imageData;
    const newImageData = new ImageData(newWidth, newHeight);
  
    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        const srcX = Math.round((x * width) / newWidth);
        const srcY = Math.round((y * height) / newHeight);
        const srcIndex = (srcY * width + srcX) * 4;
  
        const newIndex = (y * newWidth + x) * 4;
        newImageData.data[newIndex] = data[srcIndex];
        newImageData.data[newIndex + 1] = data[srcIndex + 1];
        newImageData.data[newIndex + 2] = data[srcIndex + 2];
        newImageData.data[newIndex + 3] = data[srcIndex + 3];
      }
    }
  
    return newImageData;
  }
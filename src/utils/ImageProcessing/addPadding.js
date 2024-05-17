export default function addPadding(data, width, height) {
  const widthPadding = width + 2;
  const heightPadding = height + 2;
  const newData = new Uint8ClampedArray(widthPadding * heightPadding * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const inp = (y * width + x) * 4;
      const out = ((y + 1) * widthPadding + (x + 1)) * 4;
      newData.set(data.subarray(inp, inp + 4), out);
    }
  }

  for (let y = 0; y < heightPadding; y++) {
    for (let x = 0; x < widthPadding; x++) {
      const out = (y * widthPadding + x) * 4;
      if (
        x === 0 ||
        x === widthPadding - 1 ||
        y === 0 ||
        y === heightPadding - 1
      ) {
        const nearX = Math.max(1, Math.min(x, widthPadding - 2));
        const nearY = Math.max(1, Math.min(y, heightPadding - 2));
        const nearIndex = (nearY * widthPadding + nearX) * 4;
        newData.set(newData.subarray(nearIndex, nearIndex + 4), out);
      }
    }
  }

  return newData;
}

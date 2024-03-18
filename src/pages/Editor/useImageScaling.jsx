import { useEffect, useState } from 'react';

export const useImageScaling = (image, canvas) => {
  const [scaleFactor, setScaleFactor] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fileSize, setFileSize] = useState(0);

  useEffect(() => {
    if (!image || !canvas.current) return;

    const imageObj = new Image();
    imageObj.src = image;
    imageObj.crossOrigin = 'anonymous';

    imageObj.onload = () => {
      const workspace = document.querySelector('.workspace');
      const workspaceWidth = workspace.offsetWidth;
      const workspaceHeight = workspace.offsetHeight;
      const maxWidth = workspaceWidth - 100;
      const maxHeight = workspaceHeight - 100;
      const widthScale = maxWidth / imageObj.width;
      const heightScale = maxHeight / imageObj.height;
      const newScaleFactor = Math.min(widthScale, heightScale);
      setScaleFactor(newScaleFactor);
      const scaledWidth = imageObj.width * newScaleFactor;
      const scaledHeight = imageObj.height * newScaleFactor;

      const context = canvas.current.getContext('2d');
      canvas.current.width = workspaceWidth;
      canvas.current.height = workspaceHeight;
      context.drawImage(imageObj, (maxWidth - scaledWidth) / 2 + 50, (maxHeight - scaledHeight) / 2 + 50, scaledWidth, scaledHeight);

      setWidth(scaledWidth);
      setHeight(scaledHeight);
      setFileSize(Math.floor(imageObj.src.length / 1024 * 0.77));
    };
  }, [image, canvas]);

  return { scaleFactor, width, height, fileSize };
};
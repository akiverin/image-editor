import React, { useRef, useContext, useEffect, useState } from 'react';
import { ImageContext } from '../../ImageProvider';
import './Editor.css';

import ButtonIcon from '../../components/ButtonIcon/ButtonIcon'

const Editor = ({imageData}) => {
    const { image, setImage } = useContext(ImageContext);
    const [pipetteColor, setPipetteColor] = useState("");

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [fileSize, setFileSize] = useState(0);
    const [naturalWidth, setNaturalWidth] = useState(0);
    const [colorDepth, setColorDepth] = useState(0);
    const [date, setDate] = useState(null);
    
    const imageObj = new Image();
    imageObj.src = image;
    
    const canvas = useRef();
    const context = useRef();

    useEffect(() => {
        if (!image) return;

        imageObj.crossOrigin = 'anonymous';

        const canvasElement = canvas.current;
        canvasElement.width = imageObj.width;
        canvasElement.height = imageObj.height;

        context.current = canvasElement.getContext('2d');
        context.current.drawImage(imageObj, 0, 0);

        imageObj.onload = () => {
            setWidth(imageObj.width);
            setHeight(imageObj.height);
            setFileSize(Math.floor(imageObj.src.length/1024*0.77));
            setNaturalWidth(imageObj.naturalWidth);

            const imageData = context.current.getImageData(0, 0, imageObj.width, imageObj.height);
            const colorDepth = imageData.data.length / (imageObj.width * imageObj.height);
            setColorDepth(colorDepth);

            setDate(imageObj.lastModified);
        };

    }, [image]);

    const handleCanvasClick = (event) => {
        const canvasRef = canvas.current;
        const context = canvasRef.getContext('2d');
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const pixelData = context.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
        console.log('Выбранный цвет:', color);
        setPipetteColor(color);
      };

    return (
        <section className="editor">
            <div className="editor__menu-bar">
                <ButtonIcon>
                    Файл
                </ButtonIcon>
            </div>
            <div className="editor__tool-panel tool-panel">
                <ButtonIcon title="Пипетка">
                    <svg className="tool-panel__icon" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><title/><path d="M90,24.0217a17.9806,17.9806,0,0,0-5.2969-12.7968,18.5331,18.5331,0,0,0-25.6054,0L46.23,24.0972,41.9121,19.78a5.9994,5.9994,0,1,0-8.4844,8.4844l4.3184,4.3184L7.7578,62.5647A5.9956,5.9956,0,0,0,6,66.8069V83.9221a5.9966,5.9966,0,0,0,6,6H29.1152a5.9956,5.9956,0,0,0,4.2422-1.7578L63.34,58.176l4.3184,4.3184A5.9994,5.9994,0,0,0,76.1426,54.01L71.825,49.6924,84.6973,36.8245A17.9861,17.9861,0,0,0,90,24.0217Zm-63.3691,53.9H18V69.2913L46.2305,41.0667l8.625,8.625Z"/></svg>
                </ButtonIcon>
            </div>
            <div className="editor__workspace workspace">
                <canvas className="workspace__canvas" ref={canvas} onClick={handleCanvasClick} />
            </div>
            {image &&
                <div className="editor__status-bar status-bar">
                    <span>
                        Разрешение: {width} x {height} пикселей 
                    </span>

                    <span>
                        Естественное разрешение: {naturalWidth} ппи
                    </span>

                    <span>
                        Размер файла: {fileSize} Кбайт
                    </span>

                    <span>
                        Глубина цвета: {colorDepth}
                    </span>

                    <span>
                        Дата загрузки: {date ? new Date(date).toLocaleString() : ''}
                    </span>

                    <div className="status-bar__color" style={{backgroundColor: pipetteColor}}></div>
                </div>
            }
        </section>
    );
}

export default Editor;
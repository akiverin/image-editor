import React, { useRef, useContext, useEffect, useState } from 'react';
import { ImageContext } from '@/ImageProvider';
import './Editor.css';

import ButtonIcon from '@components/ButtonIcon/ButtonIcon'
import Modal from '@components/modal/Modal';
import Dropdown from '@components/Dropdown/Dropdown';
import ScalingModal from './ScalingModal/ScalingModal';

const Editor = () => {
    const { image, setImage } = useContext(ImageContext);

    const [pipetteActive, setPipetteActive] = useState(false);
    const [pipetteColor, setPipetteColor] = useState("");
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [fileSize, setFileSize] = useState(0);
    const [scaleFactor, setScaleFactor] = useState(0);
    const [selectOption, setSelectOption] = useState(null);

    // Работа с модальны окном
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const onSelectScale = (ctx) => setScaleFactor(ctx / 100)

    const imageObj = new Image();
    imageObj.src = image;

    const canvas = useRef();
    const context = useRef();

    useEffect(() => {
        if (!image) return;

        const imageObj = new Image();
        imageObj.src = image;
        imageObj.crossOrigin = 'anonymous';

        const workspace = document.querySelector('.workspace');
        const workspaceWidth = workspace.offsetWidth;
        const workspaceHeight = workspace.offsetHeight;
        const maxWidth = workspaceWidth - 100;
        const maxHeight = workspaceHeight - 100;

        imageObj.onload = () => {
            const widthScale = maxWidth / imageObj.width;
            const heightScale = maxHeight / imageObj.height;
            const newScaleFactor = Math.min(widthScale, heightScale);
            scaleFactor !== 0 || setScaleFactor(newScaleFactor);
            const scaledWidth = imageObj.width * scaleFactor;
            const scaledHeight = imageObj.height * scaleFactor;

            const canvasElement = canvas.current;
            context.current = canvasElement.getContext('2d');

            canvasElement.width = workspaceWidth;
            canvasElement.height = workspaceHeight;
            context.current.drawImage(imageObj, (maxWidth - scaledWidth) / 2 + 50, (maxHeight - scaledHeight) / 2 + 50, scaledWidth, scaledHeight);
            setWidth(scaledWidth);
            setHeight(scaledHeight);

            setSelectOption(Math.round(newScaleFactor * 100));
            setFileSize(Math.floor(imageObj.src.length / 1024 * 0.77));
        };
    }, [image, scaleFactor, imageObj]);

    const handleCanvasClick = (event) => {
        const canvasRef = canvas.current;
        const context = canvasRef.getContext('2d');
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const pixelData = context.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
        pipetteActive && console.log('Выбранный цвет:', color);
        pipetteActive && setPipetteColor(color);
    };

    const updateImage = (image) => {
        console.log(image);
        setImage(image);
    }

    function handleMouseMove(e) {
        const rect = canvas.current.getBoundingClientRect();
        setCursor({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }

    const handleDownload = () => {
        const canvasRef = canvas.current;
        const context = canvasRef.getContext('2d');

        const imageObj = new Image();
        imageObj.src = image;
        imageObj.crossOrigin = 'anonymous';

        imageObj.onload = () => {
            canvasRef.width = imageObj.width;
            canvasRef.height = imageObj.height;
            context.drawImage(imageObj, 0, 0);
            const url = canvasRef.toDataURL();
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = url;
            a.download = 'editedImage.png';
            a.click();
            document.body.removeChild(a);
        };
    };

    return (
        <section className="editor">
            <div className="editor__menu-bar menu-bar">
                <div className="menu-bar__actions">
                    <ButtonIcon link="/">
                        Главная
                    </ButtonIcon>
                    <ButtonIcon title="Скачать" onClick={handleDownload}>
                        Скачать
                    </ButtonIcon>
                    <ButtonIcon title="Масштабирование" onClick={openModal}>
                        Масштабировать
                    </ButtonIcon>
                </div>
                <div className="menu-bar__size">
                    {selectOption && <Dropdown selectOption={selectOption} options={Array.from({ length: 289 }, (_, i) => i + 12)} onSelect={onSelectScale} />}
                </div>
            </div>
            <div className="editor__tool-panel tool-panel">
                <ButtonIcon title="Пипетка" onClick={() => { setPipetteActive(false) }} active={!pipetteActive}>
                    <svg className="tool-panel__icon" role="img" fill="currentColor" viewBox="0 0 18 18" id="SSelect18N-icon" width="18" height="18" aria-hidden="true" aria-label="" focusable="false"><path fillRule="evenodd" d="M4.252,1.027A.25.25,0,0,0,4,1.277V17.668a.25.25,0,0,0,.252.25.246.246,0,0,0,.175-.074L9.262,13h6.5a.25.25,0,0,0,.176-.427L4.427,1.1A.246.246,0,0,0,4.252,1.027Z"></path></svg>                </ButtonIcon>
                <ButtonIcon title="Пипетка" onClick={() => { setPipetteActive(!pipetteActive) }} active={pipetteActive}>
                    <svg className="tool-panel__icon" role="img" fill="currentColor" viewBox="0 0 18 18" id="SSampler18N-icon" width="18" height="18" aria-hidden="true" aria-label="" focusable="false"><path fillRule="evenodd" d="M11.228,8.519,4.116,15.631a1.235,1.235,0,1,1-1.747-1.747L9.481,6.772Zm3.636-7.466a1.8,1.8,0,0,0-1.273.527L11.328,3.843l-.707-.707a.5.5,0,0,0-.707,0L8.234,4.817a.5.5,0,0,0,0,.707l.54.54L1.662,13.177a2.235,2.235,0,1,0,3.161,3.161l7.113-7.112.54.54a.5.5,0,0,0,.707,0l1.681-1.68a.5.5,0,0,0,0-.707l-.707-.707L16.42,4.409a1.8,1.8,0,0,0,0-2.546l-.283-.283a1.8,1.8,0,0,0-1.273-.527Z"></path></svg>
                </ButtonIcon>
            </div>
            <div className="editor__workspace workspace">
                <canvas className={pipetteActive ? "workspace__canvas workspace__canvas--pipette" : "workspace__canvas"} ref={canvas} onClick={handleCanvasClick} onMouseMove={handleMouseMove} />
            </div>
            <div className="editor__status-bar status-bar">
                {image && <>
                    <span className="status-bar__text">
                        Разрешение: {Math.round(width)}&nbsp;x&nbsp;{Math.round(height)}&nbsp;px
                    </span>
                    <span className="status-bar__text">
                        Размер файла: {fileSize}&nbsp;Кб
                    </span>
                    {pipetteActive &&
                        <>
                            <span className="status-bar__text">
                                Цвет:&nbsp;
                            </span>
                            <div className="status-bar__color" style={{ backgroundColor: pipetteColor }}></div>
                            <span className="status-bar__text">
                                {pipetteColor}
                            </span>
                        </>
                    }
                    <span className="status-bar__text">
                        Координаты: x&nbsp;{cursor.x}; y&nbsp;{cursor.y}
                    </span>
                </>}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Масштабирование изображения">
                <ScalingModal image={imageObj} setImage={updateImage} closeModal={closeModal} />
            </Modal>
        </section>
    );
}

export default Editor;
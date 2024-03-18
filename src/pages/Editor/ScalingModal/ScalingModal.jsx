import React, { useState, useEffect, useContext } from 'react';
import './ScalingModal.css';
import PropTypes from 'prop-types';
import Dropdown from '@components/Dropdown/Dropdown';
import Input from '@components/Input/Input';
import TheButton from '@components/Button/TheButton';
import { ImageContext } from '@/ImageProvider';
import nearestNeighborInterpolation from '@utils/ImageProcessing/NearestNeighborInterpolation';

const ScalingModal = ({ image, scaleFactor, closeModal }) => {
    const { setImage } = useContext(ImageContext);
    const [resizeMode, setResizeMode] = useState('percent');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(0);
    const [interpolationAlgorithm, setInterpolationAlgorithm] = useState('nearest-neighbor');
    const [initialPixels, setInitialPixels] = useState(0);
    const [resizedPixels, setResizedPixels] = useState(0);

    useEffect(() => {
        if (!image) return;
        setInitialPixels((image.width * image.height / 1000000).toFixed(2));
        setResizedPixels((image.width * image.height * scaleFactor * scaleFactor / 1000000).toFixed(2));
        setHeight(image.height);
        setWidth(image.width);
        setAspectRatio(image.width / image.height);
    }, [image, scaleFactor])

    useEffect(()=>{
        if (resizeMode == "Проценты") {
            setWidth(100);
            setHeight(100);
        } else {
            setWidth(image.width);
            setHeight(image.height);
        }
    }, [resizeMode])

    const handleWidthChange = (ctx) => {
        const value = ctx;
        setWidth(value);
        if (lockAspectRatio) {
            const newHeight = resizeMode === 'Проценты' ? value : (value / aspectRatio);
            setHeight(Math.round(newHeight));
            setResizedPixels(Math.round(newHeight * value * (resizeMode === 'Проценты' ? aspectRatio : 1)));
        }
    };

    const handleHeightChange = (ctx) => {
        const value = ctx;
        setHeight(ctx);
        if (lockAspectRatio) {
            const newWidth = resizeMode === 'Проценты' ? (value / 100) * image.width : (value * aspectRatio);
            setWidth(Math.round(newWidth));
            setResizedPixels(Math.round(newWidth * value * (resizeMode === 'Проценты' ? 1 / aspectRatio : 1)));
        }
    };

    const handleResizeConfirm = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const newWidth = resizeMode === 'Проценты' ? (image.width * width) / 100 : width;
        const newHeight = resizeMode === 'Проценты' ? (image.height * height) / 100 : height;
        canvas.width = newWidth;
        canvas.height = newHeight;
        // Рисование исходного изображения на холсте
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        // Получение пиксельных данных исходного изображения
        const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
        // Применение алгоритма ближайшего соседа для интерполяции
        if (interpolationAlgorithm === 'Ближайший сосед') {
            const resizedImageData = nearestNeighborInterpolation(imageData, newWidth, newHeight);
            ctx.putImageData(resizedImageData, 0, 0);
        }
        // Обновление изображения на холсте
        setImage(canvas.toDataURL('image/png'));
        closeModal();
    };

    const handleResizeModeChange = (selectedOption) => {
        setResizeMode(selectedOption);
    };

    const handleInterpolationAlgorithmChange = (selectedOption) => {
        setInterpolationAlgorithm(selectedOption);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <form className="scaling-modal" onSubmit={handleSubmit}>
            <p className="form__text">
                Изначальные размер: {initialPixels} Мп
            </p>
            <p className="form__text">
                Размер обработанного: {resizedPixels} Мп
            </p>
            <h3 className="form__name">Настройка размеров</h3>
            <div className="form__settings">
                <label className="form__label" htmlFor="resize-mode">Единицы измерения</label>
                <Dropdown id="resize-mode" options={["Проценты", "Пиксели"]} onSelect={handleResizeModeChange} selectOption={"Пиксели"} />
                <label className="form__label" htmlFor="width">Ширина</label>
                <Input
                    type="number"
                    id="width"
                    value={width}
                    onChange={handleWidthChange}
                    min={1}
                    max={resizeMode === 'Проценты' ? 1000 : 10000}
                    step={1}
                />
                <label className="form__label" htmlFor="height">Высота</label>
                <Input
                    type="number"
                    id="height"
                    value={height}
                    onChange={handleHeightChange}
                    min={1}
                    max={resizeMode === 'Проценты' ? 1000 : 10000}
                    step={1}
                />
                <div className="form__lock">
                    <svg className="form__lock-line" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 4.5">
                        <line className="lock" y1="0.5" x2="16.5" y2="0.5"></line>
                        <line className="lock" x1="16.5" x2="16.5" y2="4.5"></line>
                    </svg>
                    <button className="form__lock-button" onClick={() => setLockAspectRatio(!lockAspectRatio)}>
                        {lockAspectRatio
                            ? <svg role="img" fill="currentColor" viewBox="0 0 18 18" id="SLockClosed18N-icon" width="18" height="18" aria-hidden="true" aria-label="" focusable="false"><path fillRule="evenodd" d="M14.5,8H14V7A5,5,0,0,0,4,7V8H3.5a.5.5,0,0,0-.5.5v8a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-8A.5.5,0,0,0,14.5,8ZM6,7a3,3,0,0,1,6,0V8H6Zm4,6.111V14.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V13.111a1.5,1.5,0,1,1,2,0Z"></path></svg>
                            : <svg role="img" fill="currentColor" viewBox="0 0 18 18" id="SLockOpen18N-icon" width="18" height="18" aria-hidden="true" aria-label="" focusable="false"><path fillRule="evenodd" d="M14.5,8H5.95V5.176A3.106,3.106,0,0,1,9,2a3.071,3.071,0,0,1,2.754,1.709c.155.32.133.573.389.573a.237.237,0,0,0,.093-.018l1.34-.534a.256.256,0,0,0,.161-.236C13.737,2.756,12.083.1,9,.1A5.129,5.129,0,0,0,4,5.146V8H3.5a.5.5,0,0,0-.5.5v8a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-8A.5.5,0,0,0,14.5,8ZM10,13.111V14.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V13.111a1.5,1.5,0,1,1,2,0Z"></path></svg>
                        }
                    </button>
                    <svg className="form__lock-line" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 7">
                        <line className="lock" y1="4.5" x2="17" y2="4.5"></line>
                        <line className="lock" x1="16.5" x2="16.5" y2="4.5"></line>
                    </svg>
                </div>
                <label className="form__label" htmlFor="interpolation-algorithm">Алгоритм интерполяции</label>
                <div className="form__select-iterpolation">
                    <Dropdown id="interpolation-algorithm" options={["Ближайший сосед"]} onSelect={handleInterpolationAlgorithmChange} selectOption={"Ближайший сосед"} />
                    <span
                        className="tooltip"
                        data-tooltip="Алгоритм ближайшего соседа берет значение цвета ближайшего пикселя исходного изображения для каждого пикселя в новом изображении. Это простой и быстрый алгоритм, но может приводить к появлению пикселизации при значительном изменении размера."
                    >
                        &#9432;
                    </span>
                </div>
            </div>
            <TheButton className="form__button" accent={true} onClick={handleResizeConfirm}>
                Выполнить
            </TheButton>
        </form>
    );
};

ScalingModal.propTypes = {
    image: PropTypes.object,
    scaleFactor: PropTypes.number,
    setImage: PropTypes.func,
    closeModal: PropTypes.func,
};

export default ScalingModal;

import React, { useEffect, useContext, useRef, useState } from "react";
import "./FilterModal.css";
import PropTypes from "prop-types";
import TheButton from "@components/Button/TheButton";
import { ImageContext } from "@/ImageProvider";
import Input from "@components/Input/Input";
import addPadding from "@utils/ImageProcessing/addPadding";

const FilterModal = ({ imageCtx, closeModal, showPreview }) => {
  const { image, setImage } = useContext(ImageContext);
  const [arrData, setArrData] = useState([]);
  const [mode, setMode] = useState("identical");

  const [matrix, setMatrix] = useState([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]);
  const modes = [
    {
      value: "identical",
      name: "Тождественное отображение",
      matrix: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    },

    {
      value: "sharpening",
      name: "Повышение резкости",
      matrix: [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0],
      ],
    },
    {
      value: "gauss",
      name: "Фильтр Гаусса",
      matrix: [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1],
      ],
    },
    {
      value: "rectangular",
      name: "Прямоугольное размытие",
      matrix: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
    },
  ];

  const [previewActive, setPreviewActive] = useState(false);
  const preview = useRef(null);

  useEffect(() => {
    if (!imageCtx) return;
    const canvasRef = preview.current;
    const ctx = canvasRef.getContext("2d");
    const imageObj = new Image();
    imageObj.src = image;
    imageObj.crossOrigin = "anonymous";
    imageObj.onload = () => {
      canvasRef.width = imageObj.width;
      canvasRef.height = imageObj.height;
      ctx.drawImage(imageObj, 0, 0);
      const data = ctx.getImageData(0, 0, imageObj.width, imageObj.height).data;
      setArrData(data);
    };
    if (previewActive) {
      const workspace = document.querySelector(".workspace");
      const workspaceWidth = workspace.offsetWidth;
      const workspaceHeight = workspace.offsetHeight;
      const maxWidth = workspaceWidth - 100;
      const maxHeight = workspaceHeight - 100;
      const widthScale = maxWidth / imageObj.width;
      const heightScale = maxHeight / imageObj.height;
      const newScaleFactor = Math.min(widthScale, heightScale);
      const scaledWidth = imageObj.width * newScaleFactor;
      const scaledHeight = imageObj.height * newScaleFactor;

      const imageObjPreview = new Image();
      imageObjPreview.src = image;
      const ctx = imageCtx.current;
      const img = new Image();
      img.src = filteringImage();

      img.onload = () => {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.drawImage(
          img,
          (maxWidth - scaledWidth) / 2 + 50,
          (maxHeight - scaledHeight) / 2 + 50,
          scaledWidth,
          scaledHeight
        );
      };
    }
  }, [imageCtx, matrix]);

  const handlePreview = (value) => {
    setPreviewActive(value);
    showPreview(value);
  };

  const handleSubmit = () => {
    const result = filteringImage();
    setImage(result);
    closeModal();
  };

  const handleMatrixChange = (i, j, value) => {
    const newMatrix = [...matrix];
    newMatrix[i][j] = value;
    setMatrix(newMatrix);
    setMode("self");
    if (previewActive) {
      handlePreview(previewActive);
    }
  };

  const filteringImage = () => {
    const imageObj = new Image();
    imageObj.src = image;
    const paddData = addPadding(arrData, imageObj.width, imageObj.height);
    const result = new Uint8ClampedArray(arrData.length);
    for (let y = 0; y < imageObj.height; y++) {
      for (let x = 0; x < imageObj.width; x++) {
        for (let z = 0; z < 4; z++) {
          const out = (y * imageObj.width + x) * 4 + z;
          let sum = 0;
          let sumMatrix = 0;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const inp = ((y + i) * (imageObj.width + 2) + (x + j)) * 4 + z;
              sum += paddData[inp] * matrix[i][j];
              sumMatrix += matrix[i][j];
            }
          }
          result[out] = sum / sumMatrix;
        }
      }
    }
    setArrData(result);

    const canvas = document.createElement("canvas");
    canvas.width = imageObj.width;
    canvas.height = imageObj.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageObj, 0, 0);
    ctx.putImageData(
      new ImageData(result, imageObj.width, imageObj.height),
      0,
      0
    );
    const newImage = canvas.toDataURL("image/jpeg");
    return newImage;
  };

  return (
    <form
      className="filter-modal form"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div className="filter-modal__inputs">
        {Array.from({ length: 3 }, (_, i) =>
          Array.from({ length: 3 }, (_, j) => (
            <div className="filter-modal__input" key={`${i}-${j}`}>
              <Input
                w100
                type="number"
                value={
                  mode !== "self"
                    ? modes.find((item) => item.value === mode)?.matrix[i][j]
                    : matrix[i][j]
                }
                onChange={(item) => {
                  handleMatrixChange(i, j, parseInt(item));
                }}
              />
            </div>
          ))
        )}
      </div>
      <fieldset className="filter-modal__table">
        {modes.map((modeItem, index) => (
          <label
            key={index}
            htmlFor={modeItem.value}
            className="filter-modal__mode"
          >
            {modeItem.name}
            <Input
              id={modeItem.value}
              name="mode"
              type="radio"
              checked={mode === modeItem.value}
              onChange={() => {
                setMode(modeItem.value);
                setMatrix(modeItem.matrix);
                handlePreview(previewActive);
              }}
            />
          </label>
        ))}
      </fieldset>
      <div className="filter-modal__settings">
        <label htmlFor="previewCheckbox">Предварительный просмотр</label>
        <Input
          type="checkbox"
          name="previewCheckbox"
          id="previewCheckbox"
          onChange={handlePreview}
        />
      </div>
      <canvas
        ref={preview}
        className={
          previewActive
            ? "filter-modal__preview--active"
            : "filter-modal__preview"
        }
      ></canvas>
      <div className="filter-modal__actions">
        <TheButton
          className="filter-modal__button"
          normal
          shadow
          onClick={() => setMode("identical")}
        >
          Сбросить
        </TheButton>
        <TheButton
          className="filter-modal__button"
          accent={true}
          onClick={() => handleSubmit()}
        >
          Применить
        </TheButton>
      </div>
    </form>
  );
};

FilterModal.propTypes = {
  imageCtx: PropTypes.object,
  closeModal: PropTypes.func,
  showPreview: PropTypes.func,
};

export default FilterModal;

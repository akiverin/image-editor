import React, { useEffect, useContext, useRef, useState } from 'react';
import './CurvesModal.css';
import PropTypes from 'prop-types';
import TheButton from '@components/Button/TheButton';
import { ImageContext } from '@/ImageProvider';
import * as d3 from "d3";
import Input from '@components/Input/Input';

const CurvesModal = ({ imageCtx, closeModal, showPreview }) => {
    const { image, setImage } = useContext(ImageContext);
    const [arrData, setArrData] = useState([]);
    const [inA, setInA] = useState(0);
    const [outA, setOutA] = useState(0);
    const [inB, setInB] = useState(255);
    const [outB, setOutB] = useState(255);
    const [arrR, setArrR] = useState([]);
    const [arrG, setArrG] = useState([]);
    const [arrB, setArrB] = useState([]);
    const [previewActive, setPreviewActive] = useState(false);
    const preview = useRef(null);

    useEffect(() => {
        if (!imageCtx) return;
        const canvasRef = preview.current;
        const ctx = canvasRef.getContext('2d');
        const imageObj = new Image();
        imageObj.src = image;
        imageObj.crossOrigin = 'anonymous';
        canvasRef.width = imageObj.width;
        canvasRef.height = imageObj.height;
        ctx.drawImage(imageObj, 0, 0);
        const data = ctx.getImageData(0, 0, imageObj.width, imageObj.height).data;
        setArrData(data);
        const tempArrR = new Array(256).fill(255);
        const tempArrG = new Array(256).fill(255);
        const tempArrB = new Array(256).fill(255);

        for (let i = 0; i < data.length; i += 4) {
            tempArrR[data[i]]++;
            tempArrG[data[i + 1]]++;
            tempArrB[data[i + 2]]++;
        }

        setArrR(tempArrR);
        setArrG(tempArrG);
        setArrB(tempArrB);
    }, [imageCtx]);

    useEffect(() => {
        if (arrR.length === 0 || arrG.length === 0 || arrB.length === 0) return;

        const combinedArray = [...arrR, ...arrG, ...arrB];
        const maxV = Math.max(...combinedArray);
        const tempArrR = arrR.map(val => val / maxV * 255);
        const tempArrG = arrG.map(val => val / maxV * 255);
        const tempArrB = arrB.map(val => val / maxV * 255);

        setInA(inA >= inB ? inB - 1 : inA)

        buildHistogram(tempArrR, tempArrG, tempArrB);
        handlePreview(previewActive)
    }, [inA, outA, inB, outB, imageCtx, arrR, arrG, arrB]);

    const buildHistogram = (dataR, dataG, dataB) => {
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };
        const width = 500 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Очистка SVG
        d3.select("#histogram").selectAll("*").remove();

        const svg = d3.select("#histogram")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleLinear()
            .domain([0, 255])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, 255])
            .range([height, 0]);

        const color = d3.scaleOrdinal()
            .domain(["dataR", "dataG", "dataB"])
            .range(["red", "green", "blue"]); // Здесь вы можете выбрать любые цвета для каждого массива данных

        // Построение линий для цветов RGB с использованием кривой Безье
        svg.append("path")
            .datum(dataR)
            .attr("class", "line")
            .style("stroke", color("dataR"))
            .style("fill", "none") // Устанавливаем прозрачный цвет заливки
            .attr("d", d3.line()
                .x((d, i) => x(i))
                .y(d => y(d))
                .curve(d3.curveBasis)); // Используем кривую Безье для плавных линий

        svg.append("path")
            .datum(dataG)
            .attr("class", "line")
            .style("stroke", color("dataG"))
            .style("fill", "none")
            .attr("d", d3.line()
                .x((d, i) => x(i))
                .y(d => y(d))
                .curve(d3.curveBasis));

        svg.append("path")
            .datum(dataB)
            .attr("class", "line")
            .style("stroke", color("dataB"))
            .style("fill", "none")
            .attr("d", d3.line()
                .x((d, i) => x(i))
                .y(d => y(d))
                .curve(d3.curveBasis));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickValues(d3.range(0, 256, 15))); // Добавляем деления по оси X

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).tickValues(d3.range(0, 256, 15))); // Добавляем деления по оси Y

        svg.selectAll(".pointA")
            .data([{ x: inA, y: outA }])
            .join("circle")
            .attr("class", "pointA")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 5)
            .style("fill", "currentColor")
            .style("cursor", "move")
            .call(d3.drag()
                .on("start", function () {
                    d3.select(this).raise().attr("stroke", "red");
                })
                .on("drag", function (event) {
                    const svgElement = document.getElementById("histogram");
                    const svgRect = svgElement.getBoundingClientRect();
                    const svgX = event.x - svgRect.left;
                    const svgY = event.y - svgRect.top;
                    const newX = Math.max(0, Math.min(inB - 1, x.invert(svgX)));
                    const newY = Math.max(0, Math.min(255, y.invert(svgY)));
                    setInA(Math.round(newX));
                    setOutA(Math.round(newY));
                })
                .on("end", function () {
                    d3.select(this).attr("stroke", null);
                })
            );

        svg.selectAll(".pointB")
            .data([{ x: inB, y: outB }])
            .join("circle")
            .attr("class", "pointB")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 5)
            .style("fill", "currentColor")
            .style("cursor", "move")
            .call(d3.drag()
                .on("start", function () {
                    d3.select(this).raise().attr("stroke", "red");
                })
                .on("drag", function (event) {
                    const svgElement = document.getElementById("histogram");
                    const svgRect = svgElement.getBoundingClientRect();
                    const svgX = event.x - svgRect.left;
                    const svgY = event.y - svgRect.top;
                    const newX = Math.max(inA + 1, Math.min(255, x.invert(svgX)));
                    const newY = Math.max(0, Math.min(255, y.invert(svgY)));
                    d3.select(this)
                        .attr("cx", x(newX))
                        .attr("cy", y(newY));
                    setInB(Math.round(newX));
                    setOutB(Math.round(newY));
                })
                .on("end", function () {
                    d3.select(this).attr("stroke", null);
                })
            );

        svg.append("line")
            .attr("class", "line")
            .attr("x1", x(inA))
            .attr("y1", y(outA))
            .attr("x2", x(inB))
            .attr("y2", y(outB))
            .style("stroke", "currentColor")
            .style("stroke-width", 1.2);

        svg.append("line")
            .attr("class", "line")
            .attr("x1", x(0))
            .attr("y1", y(outA))
            .attr("x2", x(inA))
            .attr("y2", y(outA))
            .style("stroke", "currentColor")
            .style("stroke-width", 1.2);

        svg.append("line")
            .attr("class", "line")
            .attr("x1", x(255))
            .attr("y1", y(outB))
            .attr("x2", x(inB))
            .attr("y2", y(outB))
            .style("stroke", "currentColor")
            .style("stroke-width", 1.2);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Выход") // Текст оси Y
            .style("fill", "currentColor");

        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Вход") // Текст оси X
            .style("fill", "currentColor");

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "600")
            .text("RGB Гистограмма")
            .style("fill", "currentColor");
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        imageCtx == '' && setImage(imageCtx)
        imageCtx == '' && closeModal();
    }

    const handleCurvesConfirm = () => {
        const slope = (outB - outA) / (inB - inA);
        const newData = new Uint8ClampedArray(arrData);
        for (let i = 0; i < newData.length; i += 4) {
            const r = newData[i];
            const g = newData[i + 1];
            const b = newData[i + 2];

            if (r < inA) {
                newData[i] = outA;
            } else if (r > inB) {
                newData[i] = outB;
            } else {
                newData[i] = Math.round(outA + slope * (r - inA));
            }

            if (g < inA) {
                newData[i + 1] = outA;
            } else if (g > inB) {
                newData[i + 1] = outB;
            } else {
                newData[i + 1] = Math.round(outA + slope * (g - inA));
            }

            if (b < inA) {
                newData[i + 2] = outA;
            } else if (b > inB) {
                newData[i + 2] = outB;
            } else {
                newData[i + 2] = Math.round(outA + slope * (b - inA));
            }
        }
        const img = new Image();
        img.src = image;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = newData[i];
                data[i + 1] = newData[i + 1];
                data[i + 2] = newData[i + 2];
            }

            ctx.putImageData(imageData, 0, 0);
            const newImage = canvas.toDataURL('image/jpeg');
            setImage(newImage);
            closeModal();
        };
    }

    const handleCurvesPreview = () => {
        const slope = (outB - outA) / (inB - inA);
        const newData = new Uint8ClampedArray(arrData);
        for (let i = 0; i < newData.length; i += 4) {
            const r = newData[i];
            const g = newData[i + 1];
            const b = newData[i + 2];

            if (r < inA) {
                newData[i] = outA;
            } else if (r > inB) {
                newData[i] = outB;
            } else {
                newData[i] = Math.round(outA + slope * (r - inA));
            }

            if (g < inA) {
                newData[i + 1] = outA;
            } else if (g > inB) {
                newData[i + 1] = outB;
            } else {
                newData[i + 1] = Math.round(outA + slope * (g - inA));
            }

            if (b < inA) {
                newData[i + 2] = outA;
            } else if (b > inB) {
                newData[i + 2] = outB;
            } else {
                newData[i + 2] = Math.round(outA + slope * (b - inA));
            }
        }
        const img = new Image();
        img.src = image;
        img.onload = () => {
            const canvas = imageCtx;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.current
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = newData[i];
                data[i + 1] = newData[i + 1];
                data[i + 2] = newData[i + 2];
            }

            ctx.putImageData(imageData, 0, 0);
            const newImage = canvas.toDataURL('image/png');
            ctx.drawImage(newImage, 0, 0);
        };
    }

    const handleCurvesReset = () => {
        setInA(0);
        setOutA(0);
        setInB(255);
        setOutB(255);
    }

    const handlePreview = (value) => {
        setPreviewActive(value);
        showPreview(value);
        if (value) {
            const slope = (outB - outA) / (inB - inA);
            const newData = new Uint8ClampedArray(arrData);
            for (let i = 0; i < newData.length; i += 4) {
                const r = newData[i];
                const g = newData[i + 1];
                const b = newData[i + 2];

                if (r < inA) {
                    newData[i] = outA;
                } else if (r > inB) {
                    newData[i] = outB;
                } else {
                    newData[i] = Math.round(outA + slope * (r - inA));
                }

                if (g < inA) {
                    newData[i + 1] = outA;
                } else if (g > inB) {
                    newData[i + 1] = outB;
                } else {
                    newData[i + 1] = Math.round(outA + slope * (g - inA));
                }

                if (b < inA) {
                    newData[i + 2] = outA;
                } else if (b > inB) {
                    newData[i + 2] = outB;
                } else {
                    newData[i + 2] = Math.round(outA + slope * (b - inA));
                }
            }
            const img = new Image();
            img.src = image;
            const ctx = preview.current.getContext('2d');
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = newData[i];
                    data[i + 1] = newData[i + 1];
                    data[i + 2] = newData[i + 2];
                }
                ctx.putImageData(imageData, 0, 0);
            };

            if (value) {
                handleCurvesPreview()
            } else {
                const canvas = imageCtx;
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.current
                ctx.drawImage(img, 0, 0);
            }
        }
    }

    return (
        <form className="curves-modal form" onSubmit={handleSubmit}>
            <svg id="histogram" width="600" height="400"></svg>
            <div className="curves-modal__edit">
                <div className="curves-modal__table">
                    <h3 className="curves-modal__name curves-modal__name--a">A</h3>
                    <h3 className="curves-modal__name curves-modal__name--b">B</h3>
                    <p className="curves-modal__type">Вход</p>
                    <Input type="number" max={Number(inB) - 1} min={0} value={Number(inA)} onChange={setInA} />
                    <Input type="number" max={255} min={Number(inA) + 1} value={Number(inB)} onChange={setInB} />
                    <p className="curves-modal__type">Выход</p>
                    <Input type="number" max={255} min={0} value={Number(outA)} onChange={setOutA} />
                    <Input type="number" max={255} min={0} value={Number(outB)} onChange={setOutB} />
                </div>
                <div className="curves-modal__settings">
                    <label htmlFor="previewCheckbox">Предварительный просмотр</label>
                    <Input type="checkbox" name="previewCheckbox" id="previewCheckbox" onChange={handlePreview} />
                </div>
            </div>
            <canvas ref={preview} className={previewActive ? "curves-modal__preview--active" : "curves-modal__preview"}></canvas>
            <div className="curves-modal__actions">
                <TheButton className="curves-modal__button" normal shadow onClick={handleCurvesReset}>
                    Сбросить
                </TheButton>
                <TheButton className="curves-modal__button" accent={true} onClick={handleCurvesConfirm}>
                    Применить
                </TheButton>
            </div>

        </form>
    );
};

CurvesModal.propTypes = {
    imageCtx: PropTypes.object,
    scaleFactor: PropTypes.number,
    setImage: PropTypes.func,
    closeModal: PropTypes.func,
    showPreview: PropTypes.func,
};

export default CurvesModal;

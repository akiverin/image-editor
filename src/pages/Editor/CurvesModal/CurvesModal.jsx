import React, { useEffect, useContext, useRef } from 'react';
import './CurvesModal.css';
import PropTypes from 'prop-types';
import TheButton from '@components/Button/TheButton';
import { ImageContext } from '@/ImageProvider';
import * as d3 from "d3";


const CurvesModal = ({ imageCtx, closeModal }) => {
    const { image, setImage } = useContext(ImageContext);
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
        console.log('wh', imageObj.width, imageObj.height)

        const data = ctx.getImageData(0, 0, imageObj.width, imageObj.height).data;
    
        const tempArrR = new Array(256).fill(255);
        const tempArrG = new Array(256).fill(255);
        const tempArrB = new Array(256).fill(255);
    
        for (let i = 0; i < data.length; i += 4) {
            tempArrR[data[i]]++;
            tempArrG[data[i + 1]]++;
            tempArrB[data[i + 2]]++;
        }

        console.log(tempArrR, tempArrG, tempArrB)

        const combinedArray = [...tempArrR, ...tempArrG, ...tempArrB];
        const maxV = Math.max(...combinedArray);
        console.log(maxV)

        for (let i = 0; i < 256; i ++) {
            tempArrR[i] = tempArrR[i] / maxV * 255;
            tempArrG[i] = tempArrG[i] / maxV * 255;
            tempArrB[i] = tempArrB[i] / maxV * 255;
        }
    
        buildHistogram(tempArrR, tempArrG, tempArrB);
    }, [imageCtx]);
    
    const buildHistogram = (dataR, dataG, dataB) => {
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
    
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
            .call(d3.axisBottom(x).ticks(17).tickFormat(d3.format("d"))); // Добавляем деления по оси X
    
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).ticks(17)); // Добавляем деления по оси Y
    
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
        imageCtx==''&&setImage(imageCtx)
        imageCtx==''&&closeModal();
    }

    const handleCurvesConfirm = () => {
        console.log('Выполнить')
    }


    return (
        <form className="curves-modal form" onSubmit={handleSubmit}>
            <svg id="histogram" width="600" height="400"></svg>
            <canvas ref={preview} className="curves-modal__preview"></canvas>
            <TheButton className="form__button" accent={true} onClick={handleCurvesConfirm}>
                Выполнить
            </TheButton>
        </form>
    );
};

CurvesModal.propTypes = {
    imageCtx: PropTypes.object,
    scaleFactor: PropTypes.number,
    setImage: PropTypes.func,
    closeModal: PropTypes.func,
};

export default CurvesModal;
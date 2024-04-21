import React, { useEffect, useContext, useRef, useState } from 'react';
import './CurvesModal.css';
import PropTypes from 'prop-types';
import TheButton from '@components/Button/TheButton';
import { ImageContext } from '@/ImageProvider';
import * as d3 from "d3";
import Input from '@components/Input/Input';


const CurvesModal = ({ imageCtx, closeModal }) => {
    const { image, setImage } = useContext(ImageContext);
    const [inA, setInA] = useState(0);
    const [outA, setOutA] = useState(0);
    const [inB, setInB] = useState(255);
    const [outB, setOutB] = useState(255);
    const [arrR, setArrR] = useState([]);
    const [arrG, setArrG] = useState([]);
    const [arrB, setArrB] = useState([]);
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

        // console.log(tempArrR, tempArrG, tempArrB)

        // const combinedArray = [...tempArrR, ...tempArrG, ...tempArrB];
        // const maxV = Math.max(...combinedArray);
        // console.log(maxV)

        // for (let i = 0; i < 256; i ++) {
        //     tempArrR[i] = tempArrR[i] / maxV * 255;
        //     tempArrG[i] = tempArrG[i] / maxV * 255;
        //     tempArrB[i] = tempArrB[i] / maxV * 255;
        // }
    
        // buildHistogram(tempArrR, tempArrG, tempArrB);
    }, [imageCtx]);

    useEffect(() => {
        if (arrR.length === 0 || arrG.length === 0 || arrB.length === 0) return;

        const combinedArray = [...arrR, ...arrG, ...arrB];
        const maxV = Math.max(...combinedArray);
        const tempArrR = arrR.map(val => val / maxV * 255);
        const tempArrG = arrG.map(val => val / maxV * 255);
        const tempArrB = arrB.map(val => val / maxV * 255);
        
        buildHistogram(tempArrR, tempArrG, tempArrB);
    }, [inA, outA, inB, outB, imageCtx, arrR, arrG, arrB]);
    
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
            .call(d3.axisBottom(x).tickValues(d3.range(0, 256, 15))); // Добавляем деления по оси X
    
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).tickValues(d3.range(0, 256, 15))); // Добавляем деления по оси Y

        svg.selectAll(".point")
            .data([{x: inA, y: outA}, {x: inB, y: outB}])
            .enter().append("circle")
            .attr("class", "point")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 5)
            .style("fill", "currentColor");
        
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
        imageCtx==''&&setImage(imageCtx)
        imageCtx==''&&closeModal();
    }

    const handleCurvesConfirm = () => {
        console.log('Выполнить')
    }

    const handleCurvesReset = () => {
        setInA(0);
        setOutA(0);
        setInB(255);
        setOutB(255);
    }


    return (
        <form className="curves-modal form" onSubmit={handleSubmit}>
            <svg id="histogram" width="600" height="400"></svg>
            <div className="curves-modal__table">
                <h3 className="curves-modal__name curves-modal__name--a">A</h3>
                <h3 className="curves-modal__name curves-modal__name--b">B</h3>
                <p className="curves-modal__type">Вход</p>
                <Input type="number" max={255} min={0} value={inA} onChange={setInA} />
                <Input type="number" max={255} min={0} value={inB} onChange={setInB} />
                <p className="curves-modal__type">Выход</p>
                <Input type="number" max={255} min={0} value={outA} onChange={setOutA} />
                <Input type="number" max={255} min={0} value={outB} onChange={setOutB} />
            </div>
            <canvas ref={preview} className="curves-modal__preview"></canvas>
            <div className="curves-modal__actions">
                <TheButton className="curves-modal__button" normal shadow onClick={handleCurvesReset}>
                    Сбросить
                </TheButton>
                <TheButton className="curves-modal__button" accent={true} onClick={handleCurvesConfirm}>
                    Выполнить
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
};

export default CurvesModal;

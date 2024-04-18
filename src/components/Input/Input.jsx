import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = ({ type, placeholder, onChange, id, value, min, max, step, w100 }) => {
    const [content, setContent] = useState(value || '');

    useEffect(() => {
        setContent(value || '');
    }, [value]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setContent(newValue);
        type=="number" ? onChange(Number(newValue)) : onChange(newValue);
    };

    return (
        <input
            id={id}
            type={type}
            className={w100?"input input--full":"input"} 
            onChange={handleChange}
            placeholder={placeholder}
            value={content}
            min={min}
            max={max}
            step={step}
        />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func,
    id: PropTypes.string,
    w100: PropTypes.bool,
};

export default Input;

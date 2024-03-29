import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Dropdown.css';

const Dropdown = ({ selectOption, options, onSelect, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(selectOption.toString() || '');
    const [selectedOption, setSelectedOption] = useState(selectOption.toString() || '');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        setSelectedOption(selectOption);
      }, [selectOption]);

    useEffect(() => {
        const filtered = options.filter((option) =>
            option.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [options, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOptionSelect = (option) => {
        console.log(selectOption)
        const optionValue = option.toString();
        setSelectedOption(optionValue);
        setSearchTerm(optionValue);
        onSelect(optionValue);
        setIsOpen(false);
    };

    const handleInputFocus = () => {
        setIsOpen(true);
        setSearchTerm('');
        setIsFocus(true);
    };
    
    return (
        <div className="dropdown">
            <div className={isFocus?"dropdown__field dropdown__field--open":"dropdown__field"}>
                <input
                    id={id}
                    type="text"
                    className="dropdown__input"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Поиск"
                    onFocus={handleInputFocus}
                    onBlur={()=>{setIsFocus(false); setIsOpen(false)}}
                />
                <button className="dropdown__button" onClick={()=>{setIsFocus(!isFocus); setIsOpen(!isOpen)}} onBlur={()=>{setIsFocus(false); setIsOpen(false)}}>
                    <span className="visually-hidden">Открыть выпадающий список</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" role="img" fill="currentColor" height="24" width="24" aria-hidden="false" aria-label="Chevron Down">
                        <path d="M8 14.02a2 2 0 0 1 3.411-1.411l6.578 6.572 6.578-6.572a2 2 0 0 1 2.874 2.773l-.049.049-7.992 7.984a2 2 0 0 1-2.825 0l-7.989-7.983A1.989 1.989 0 0 1 8 14.02Z"></path>
                    </svg>
                </button>
                
            </div>
            <ul className="dropdown__list" style={{ display: isOpen ? 'block' : 'none' }}>
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            className="dropdown__item"
                        >
                            <button
                                className="dropdown__option"
                                onMouseDown={() => handleOptionSelect(option)}
                            >
                                <svg style={{"opacity": selectedOption == option?1:0}} viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z" fill="#df6d21"/></svg>
                                {option.toString()}
                            </button>
                        </li>
                    ))}
                </ul>
        </div>
    );
};

Dropdown.propTypes = {
    selectOption: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func,
    id: PropTypes.string,
};


export default Dropdown;

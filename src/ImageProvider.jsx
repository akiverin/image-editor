import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(null);

  const updateImage = (newImage) => {
    setImage(newImage);
  };

  return (
    <ImageContext.Provider value={{ image, setImage: updateImage }}>
      {children}
    </ImageContext.Provider>
  );
};

ImageProvider.propTypes = {
  children: PropTypes.node,
};
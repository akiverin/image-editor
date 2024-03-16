import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
export const ImageContext = createContext();

export const ImageProvider = ({children}) => {
  const [image, setImage] = useState(null);

  return (
    <ImageContext.Provider value={{image, setImage}}>
      {children}
    </ImageContext.Provider>
  )
}

ImageProvider.propTypes = {
  children: PropTypes.node,
};
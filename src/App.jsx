import React, { useRef, useState } from 'react'
import './App.css'
import Modal from './components/modal/Modal.jsx'; 

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const inputFile = useRef(null);

  const handleButtonClick = () => {
    inputFile.current.click();
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <h1>Обработка изображений</h1>
      <div className="card">
        <p>
          Отредактируйте изображение с вашего компьютера.
        </p>
      </div>
      <p className="read-the-docs">
        Загрузите свое изображение
      </p>
      <input ref={inputFile} style={{ display: 'none' }} type="file" accept="image/*" onChange={handleImageChange} />
      <div className="actions">
        <button onClick={handleButtonClick}>Открыть изображение</button>
        <button onClick={openModal}>Открыть модальное окно</button>
      </div>
      {selectedImage && <img className="preview" src={selectedImage} alt="Uploaded"/>}
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        <p>Содержимое модального окна</p>
      </Modal>
    </>
  )
}

export default App

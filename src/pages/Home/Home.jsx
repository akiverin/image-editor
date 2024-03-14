import React, { useRef, useState, useContext } from 'react'
import { ImageContext } from '../../ImageProvider';
import Modal from '../../components/modal/Modal';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const { image, setImage } = useContext(ImageContext);
    const [imageLink, setImageLink] = useState("");
    const inputFile = useRef(null);

    const handleButtonClick = () => {
        inputFile.current.click();
    };

    const handleImageChange = (event) => {
        const input = event.target;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64Image = e.target.result;
              setImage(base64Image);
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            const imageUrl = imageLink;
            console.log(imageUrl);
            fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImage(e.target.result);
                };
                reader.readAsDataURL(blob);
            });
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };
    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <section className="home" id="wrapper">
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
                {/* <button onClick={openModal}>Открыть модальное окно</button> */}
                <button onClick={()=>setLinkOpen(!linkOpen)}>{!linkOpen?"Загрузить":"Закрыть загрузку"} ссылкой изображение</button>
            </div>
            {linkOpen && 
                <div className="actions">
                    <input 
                    type="text" 
                    className="add-link" 
                    value={imageLink} 
                    onChange={(e) => setImageLink(e.target.value)}
                    placeholder="Введите URL картинки"
                    />
                    <button onClick={handleImageChange}>Добавить</button>
                </div>
            }
            {image &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    {image.startsWith('data:image') ? (
                        <img className="preview" src={image} alt="Uploaded" />
                    ) : (
                        <img className="preview" src={imageLink} alt="Uploaded" />
                    )}
                    <Link to={{
                        pathname: '/editor',
                        state: { 
                            imageData: image || imageLink
                        }
                    }}>Перейти в редактор</Link>
                </div>
            }
            <Modal isOpen={modalIsOpen} onClose={closeModal}>
                <p>Содержимое модального окна</p>
            </Modal>
        </section>
    )
}

export default Home;

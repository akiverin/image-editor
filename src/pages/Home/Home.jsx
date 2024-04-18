import React, { useRef, useState, useContext } from 'react'
import { ImageContext } from '@/ImageProvider';
import Modal from '@components/modal/Modal';
import TheButton from '@components/Button/TheButton';
import './Home.css';
// import { Link } from 'react-router-dom';
import Input from '../../components/Input/Input';

const Home = () => {
    const [linkOpen, setLinkOpen] = useState(false);
    const { image, setImage } = useContext(ImageContext);
    const [imageLink, setImageLink] = useState("");
    const inputFile = useRef(null);
    // Работа с модальны окном
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleButtonClick = () => inputFile.current.click();

    const handleImageChange = (event) => {
        const input = event.target;
        console.log(imageLink)
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
    return (
        <section className="home" id="wrapper">
            <h1 className="home__title">Обработка изображений</h1>
            <div className="home__head">
                <p>Отредактируйте изображение с вашего компьютера.</p>
            </div>
            <input ref={inputFile} style={{ display: 'none' }} type="file" accept="image/*" onChange={handleImageChange} />
            <div className="home__actions">
                <div className="home__load-buttons">
                    <TheButton onClick={handleButtonClick} title="Загрузка изображения с компьютера" normal={true} adjacent="left">Открыть изображение</TheButton>
                    <TheButton onClick={()=>setLinkOpen(!linkOpen)} normal adjacent="right"><svg height={18} width={18} viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M598.6 41.41C570.1 13.8 534.8 0 498.6 0s-72.36 13.8-99.96 41.41l-43.36 43.36c15.11 8.012 29.47 17.58 41.91 30.02c3.146 3.146 5.898 6.518 8.742 9.838l37.96-37.96C458.5 72.05 477.1 64 498.6 64c20.67 0 40.1 8.047 54.71 22.66c14.61 14.61 22.66 34.04 22.66 54.71s-8.049 40.1-22.66 54.71l-133.3 133.3C405.5 343.1 386 352 365.4 352s-40.1-8.048-54.71-22.66C296 314.7 287.1 295.3 287.1 274.6s8.047-40.1 22.66-54.71L314.2 216.4C312.1 212.5 309.9 208.5 306.7 205.3C298.1 196.7 286.8 192 274.6 192c-11.93 0-23.1 4.664-31.61 12.97c-30.71 53.96-23.63 123.6 22.39 169.6C293 402.2 329.2 416 365.4 416c36.18 0 72.36-13.8 99.96-41.41L598.6 241.3c28.45-28.45 42.24-66.01 41.37-103.3C639.1 102.1 625.4 68.16 598.6 41.41zM234 387.4L196.1 425.3C181.5 439.1 162 448 141.4 448c-20.67 0-40.1-8.047-54.71-22.66c-14.61-14.61-22.66-34.04-22.66-54.71s8.049-40.1 22.66-54.71l133.3-133.3C234.5 168 253.1 160 274.6 160s40.1 8.048 54.71 22.66c14.62 14.61 22.66 34.04 22.66 54.71s-8.047 40.1-22.66 54.71L325.8 295.6c2.094 3.939 4.219 7.895 7.465 11.15C341.9 315.3 353.3 320 365.4 320c11.93 0 23.1-4.664 31.61-12.97c30.71-53.96 23.63-123.6-22.39-169.6C346.1 109.8 310.8 96 274.6 96C238.4 96 202.3 109.8 174.7 137.4L41.41 270.7c-27.6 27.6-41.41 63.78-41.41 99.96c-.0001 36.18 13.8 72.36 41.41 99.97C69.01 498.2 105.2 512 141.4 512c36.18 0 72.36-13.8 99.96-41.41l43.36-43.36c-15.11-8.012-29.47-17.58-41.91-30.02C239.6 394.1 236.9 390.7 234 387.4z"/></svg></TheButton>
                </div>
                <TheButton onClick={openModal} title="Просмотр информации о разработчике">Информация об авторе</TheButton>
            </div>
            {linkOpen && 
                <div className="home__actions">
                    <Input 
                    type="text"
                    value={imageLink} 
                    onChange={setImageLink}
                    placeholder="Введите URL картинки"
                    />
                    <TheButton onClick={handleImageChange} title="Выполнить загрузку изображения" normal>Загрузить</TheButton>
                </div>
            }
            {image &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    {image.startsWith('data:image') ? (
                        <img className="preview" src={image} alt="Uploaded" />
                    ) : (
                        <img className="preview" src={imageLink} alt="Uploaded" />
                    )}
                    <TheButton accent to={{
                        pathname: '/editor',
                        state: { 
                            imageData: image || imageLink
                        }
                    }}>Перейти в редактор</TheButton>
                </div>
            }
            <Modal className="about" isOpen={isModalOpen} onClose={closeModal} title="Об авторе">
                <p className="about__text">Работа выполнена Кивериным А.А.</p>
                <div className="about__field">
                    <p className="about__text">Репозиторий</p>
                    <a className="about__link" href="https://github.com/akiverin/image-editor">GitHub</a>
                </div>
            </Modal>
        </section>
    )
}

export default Home;

import React from "react";
import styles from "./ImageModalWindow.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentImage, toggleImageModal } from "../../store/reducers/imageModalSlice";
import { AiOutlineDownload } from "react-icons/ai";

const ImageModalWindow = () => {
    const dispatch = useDispatch();
    const {currentImage} = useSelector((state) => state.imgModal)

    const closeImageModal = () => {
        dispatch(toggleImageModal())
        dispatch(setCurrentImage(null))
    };

    return (
        <div className={styles.openedImage}>
            <div className={styles.openedImageContainer}>
                <div className={styles.openedImageControl}>
                    <a href={currentImage} download className={styles.icon}><AiOutlineDownload /></a>
                    <span className={styles.closeButton} onClick={closeImageModal}>×</span>
                </div>
                <div className={styles.openedImageContent}>
                    <img src={currentImage} alt="Expanded view" />
                </div>
            </div>
        </div>
    );
};

export default ImageModalWindow;
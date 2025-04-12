import React from "react";
import styles from "./MessageAttachments.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleImageModal, setCurrentImage } from "../../store/reducers/imageModalSlice";
import AttachmentType from "../AttachmentType/AttachmentType";
import ImageModalWindow from "../ImageModalWindow/ImageModalWindow";

const MessageAttachments = ({ attachments }) => {
  const dispatch = useDispatch();
  const { isImageOpen } = useSelector((state) => state.imgModal);

  const openImageModal = (imageUrl) => {
    dispatch(setCurrentImage(imageUrl));
    dispatch(toggleImageModal());
  };

  const getGridClass = () => {
    const count = attachments.length;
    if (count === 1) return styles.one;
    if (count === 2) return styles.two;
    if (count === 3) return styles.three;
    if (count === 4) return styles.four;
    if (count === 5) return styles.five;
    return styles.more; 
  };

  const getFileSize = (index) => {
    if (attachments.length === 5 && index < 2) return 'biggerSize';
    return 'defaultSize';
  };
  
  const getItemClass = (index) => {
    if (attachments.length === 5 && index < 2) return 'firstRowItem';
    else if (attachments.length === 5 && index >= 2) return 'secondRowItem';
    else return ""
  }

  return (
    <div className={`${styles.courseMessageAttachments} ${getGridClass()}`}>
      {attachments.map((attachment, index) => (
        <AttachmentType
          attachment={attachment}
          key={attachment._id}
          openImageModal={openImageModal}
          fileSizeClass={getFileSize(index)}
          itemClass={getItemClass(index)}
        />
      ))}
      {isImageOpen && <ImageModalWindow />}
    </div>
  );
};

export default MessageAttachments;

import React from 'react';
import './ImageViewer.scss';

interface ImageViewerProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="image-viewer" onClick={onClose}>
      <div className="image-viewer__content">
        <img src={imageUrl} alt="Full size" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
}; 
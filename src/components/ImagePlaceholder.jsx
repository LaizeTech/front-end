import React from 'react';
import { X } from 'lucide-react';
import './ImagePlaceholder.css';

const ImagePlaceholder = ({ width = '100%', height = '200px', className = '' }) => {
  return (
    <div 
      className={`image-placeholder ${className}`}
      style={{ width, height }}
    >
      <X size={40} className="placeholder-icon" />
    </div>
  );
};

export default ImagePlaceholder;


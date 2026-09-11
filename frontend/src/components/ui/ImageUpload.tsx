import React, { useRef, useState } from 'react';
import { UploadCloud, X, Star, MoveLeft, MoveRight } from 'lucide-react';
import { uploadService } from '../../services/upload.service';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

import '../../styles/components/ImageUpload.css';

interface ImageUploadProps {
  coverImage: string;
  images: string[];
  onChange: (coverImage: string, images: string[]) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ coverImage, images, onChange, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Combine coverImage and images for display, making sure coverImage is distinct or handled appropriately
  const allImages = coverImage ? [coverImage, ...images.filter(img => img !== coverImage)] : images;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await handleUpload(Array.from(files));
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      setIsUploading(true);
      const urls = await uploadService.uploadImages(files);

      const newImages = [...allImages, ...urls];
      let newCover = coverImage;

      if (!newCover && newImages.length > 0) {
        newCover = newImages[0];
      }

      const newGallery = newImages.filter(img => img !== newCover);
      onChange(newCover, newGallery);
      toast.success('Images uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleUpload(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (imgToRemove: string) => {
    if (disabled) return;

    let newCover = coverImage;
    let newGallery = images.filter(img => img !== imgToRemove);

    if (imgToRemove === coverImage) {
      if (newGallery.length > 0) {
        newCover = newGallery[0];
        newGallery = newGallery.slice(1);
      } else {
        newCover = '';
      }
    }

    onChange(newCover, newGallery);
  };

  const setAsCover = (imgUrl: string) => {
    if (disabled || imgUrl === coverImage) return;

    const newGallery = allImages.filter(img => img !== imgUrl);
    onChange(imgUrl, newGallery);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (disabled) return;

    // We only reorder within the gallery, cover image remains static
    // allImages[0] is coverImage if it exists. 
    // index in allImages corresponds to the display.
    const imgUrl = allImages[index];
    if (imgUrl === coverImage) return; // Can't move cover image

    const galleryIndex = images.indexOf(imgUrl);
    if (galleryIndex === -1) return;

    const newGallery = [...images];
    if (direction === 'left' && galleryIndex > 0) {
      [newGallery[galleryIndex - 1], newGallery[galleryIndex]] = [newGallery[galleryIndex], newGallery[galleryIndex - 1]];
    } else if (direction === 'right' && galleryIndex < newGallery.length - 1) {
      [newGallery[galleryIndex], newGallery[galleryIndex + 1]] = [newGallery[galleryIndex + 1], newGallery[galleryIndex]];
    }

    onChange(coverImage, newGallery);
  };

  // Helper function to resolve the API URL for local images
  const resolveImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    // Remove /api/v1 to just get the base domain for static files
    const BASE_URL = API_URL.replace('/api/v1', '');
    return `${BASE_URL}${url}`;
  };

  return (
    <div className="image-upload-container">
      <div
        className={`upload-dropzone ${isDragging ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <div className="upload-loading">
            <LoadingSpinner size="sm" />
            <span>Uploading images...</span>
          </div>
        ) : (
          <div className="upload-prompt">
            <UploadCloud size={32} />
            <h4>Click or drag images here to upload</h4>
            <p>Support for JPG, PNG, WebP up to 5MB</p>
          </div>
        )}
      </div>

      {allImages.length > 0 && (
        <div className="image-gallery-grid">
          {allImages.map((imgUrl, index) => (
            <div key={`${imgUrl}-${index}`} className={`image-card ${imgUrl === coverImage ? 'is-primary' : ''}`}>
              <img src={resolveImageUrl(imgUrl)} alt={`Gallery item ${index}`} />

              <div className="image-card-overlay">
                {imgUrl === coverImage ? (
                  <span className="primary-badge">Cover Image</span>
                ) : (
                  <span /> /* spacer */
                )}

                {!disabled && (
                  <div className="image-actions">
                    {imgUrl !== coverImage && (
                      <>
                        <button type="button" className="image-action-btn primary" title="Set as Cover" onClick={() => setAsCover(imgUrl)}>
                          <Star size={14} />
                        </button>
                        <button type="button" className="image-action-btn" title="Move Left" onClick={() => moveImage(index, 'left')}>
                          <MoveLeft size={14} />
                        </button>
                        <button type="button" className="image-action-btn" title="Move Right" onClick={() => moveImage(index, 'right')}>
                          <MoveRight size={14} />
                        </button>
                      </>
                    )}
                    <button type="button" className="image-action-btn delete" title="Remove" onClick={() => removeImage(imgUrl)}>
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

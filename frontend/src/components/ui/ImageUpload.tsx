import React, { useRef, useState } from 'react';
import { UploadCloud, X, Star, MoveLeft, MoveRight, Link as LinkIcon, Plus } from 'lucide-react';
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
  const [urlInput, setUrlInput] = useState('');

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
      const uploadedUrls = Array.isArray(urls) ? urls : (urls as any)?.data || [];

      const newImages = [...allImages, ...uploadedUrls];
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

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    // Split by comma or whitespace/newlines in case user pastes multiple URLs
    const urlsToAdd = urlInput
      .split(/[\n,]+/)
      .map(u => u.trim())
      .filter(u => u.length > 0);

    const validUrls: string[] = [];
    for (const url of urlsToAdd) {
      if (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('/') ||
        url.startsWith('data:image/')
      ) {
        validUrls.push(url);
      } else {
        toast.error(`Invalid URL: ${url.length > 30 ? url.substring(0, 30) + '...' : url}. Must start with http:// or https://`);
      }
    }

    if (validUrls.length === 0) return;

    const newImages = [...allImages, ...validUrls];
    let newCover = coverImage;

    if (!newCover && newImages.length > 0) {
      newCover = newImages[0];
    }

    const newGallery = newImages.filter(img => img !== newCover);
    onChange(newCover, newGallery);
    setUrlInput('');
    toast.success(validUrls.length === 1 ? 'Image link added!' : `${validUrls.length} image links added!`);
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

    const imgUrl = allImages[index];
    if (imgUrl === coverImage) return;

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
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const BASE_URL = API_URL.replace('/api/v1', '');
    return `${BASE_URL}${url}`;
  };

  return (
    <div className="image-upload-container">
      {/* Option 1: Direct Image Link / URL Input */}
      <div className="image-url-input-box">
        <div className="image-url-input-wrapper">
          <LinkIcon size={16} className="image-url-icon" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder="Paste image link / web URL (e.g. Unsplash, CDN link)..."
            className="image-url-field"
            disabled={disabled || isUploading}
          />
          <button
            type="button"
            onClick={() => handleAddUrl()}
            disabled={disabled || !urlInput.trim() || isUploading}
            className="image-url-add-btn"
          >
            <Plus size={16} />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      <div className="image-upload-divider">
        <span>or upload files</span>
      </div>

      {/* Option 2: Drag & Drop File Upload */}
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
            <UploadCloud size={28} />
            <h4>Click or drag image files here</h4>
            <p>Support for JPG, PNG, WebP up to 5MB</p>
          </div>
        )}
      </div>

      {/* Image Gallery Preview Grid */}
      {allImages.length > 0 && (
        <div className="image-gallery-grid">
          {allImages.map((imgUrl, index) => (
            <div key={`${imgUrl}-${index}`} className={`image-card ${imgUrl === coverImage ? 'is-primary' : ''}`}>
              <img
                src={resolveImageUrl(imgUrl)}
                alt={`Gallery item ${index}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80';
                }}
              />

              <div className="image-card-overlay">
                {imgUrl === coverImage ? (
                  <span className="primary-badge">Cover Photo</span>
                ) : (
                  <span />
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

import React, { useRef, useState } from 'react';
import { UploadCloud, X, Star, MoveLeft, MoveRight, Link as LinkIcon, Plus } from 'lucide-react';
import { uploadService } from '../../services/upload.service';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { getImageUrl, handleImageError, normalizeImageUrl, DEFAULT_RESORT_IMAGE } from '../../utils/imageUrl';

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
    for (const rawUrl of urlsToAdd) {
      // If user pasted a Google Photos web album page link (not the direct image stream)
      if (rawUrl.includes('photos.app.goo.gl') || (rawUrl.includes('photos.google.com') && !rawUrl.includes('googleusercontent.com'))) {
        toast.error(
          'Google Photos album page link detected! To embed: Open the photo in Google Photos, right-click the image, and click "Copy image address".',
          { duration: 6000 }
        );
        continue;
      }

      const normalized = normalizeImageUrl(rawUrl);
      if (
        normalized.startsWith('http://') ||
        normalized.startsWith('https://') ||
        normalized.startsWith('/') ||
        normalized.startsWith('data:image/')
      ) {
        validUrls.push(normalized);
      } else {
        toast.error(`Invalid URL: ${rawUrl.length > 30 ? rawUrl.substring(0, 30) + '...' : rawUrl}. Must start with http:// or https://`);
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
    toast.success(validUrls.length === 1 ? 'Image link added successfully!' : `${validUrls.length} image links added!`);
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

  return (
    <div className="image-upload-container">
      {/* Option 1: Direct Image Link / Google Photos / Google Drive / Web URL Input */}
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
            placeholder="Paste Google Photos, Google Drive, or Web image URL..."
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
        <div className="image-url-helper-text">
          <span>💡 Supports direct image links, Google Drive share links, and Google Photos (right-click image & choose &quot;Copy image address&quot;).</span>
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
                src={getImageUrl(imgUrl, DEFAULT_RESORT_IMAGE)}
                alt={`Gallery item ${index}`}
                onError={(e) => handleImageError(e, DEFAULT_RESORT_IMAGE)}
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

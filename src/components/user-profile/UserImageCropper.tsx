import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';

interface ImageCropperProps {
  image: string;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
  isCircular?: boolean;
  isOpen: boolean;
}

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragStartState {
  x: number;
  y: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

interface ImageDataState {
  img: HTMLImageElement;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  scaleToFit: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

export const ImageCropper: React.FC<ImageCropperProps> = ({ 
  image, 
  onCrop, 
  onCancel, 
  aspectRatio = 1, 
  isCircular = false,
  isOpen
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState<CropState>({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<string | false>(false);
  const [dragStart, setDragStart] = useState<DragStartState>({ x: 0, y: 0, cropX: 0, cropY: 0, cropWidth: 0, cropHeight: 0 });
  const [imageData, setImageData] = useState<ImageDataState | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [imageOffset] = useState<MousePosition>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const maxWidth = 600;
      const maxHeight = 450;
      const width = img.width;
      const height = img.height;
      
      const scaleToFit = Math.min(maxWidth / width, maxHeight / height, 1);
      const displayWidth = width * scaleToFit;
      const displayHeight = height * scaleToFit;
      
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      
      setImageData({ 
        img, 
        width: displayWidth, 
        height: displayHeight,
        originalWidth: img.width,
        originalHeight: img.height,
        scaleToFit
      });
      
      const cropSize = Math.min(displayWidth, displayHeight) * 0.6;
      const cropHeight = isCircular ? cropSize : cropSize / aspectRatio;
      setCrop({
        x: (displayWidth - cropSize) / 2,
        y: (displayHeight - cropHeight) / 2,
        width: cropSize,
        height: cropHeight
      });
    };
    img.src = image;
  }, [image, aspectRatio, isCircular]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { img, width, height } = imageData;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const offsetX = (width - scaledWidth) / 2 + imageOffset.x;
    const offsetY = (height - scaledHeight) / 2 + imageOffset.y;
    
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
    ctx.restore();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'destination-out';
    if (isCircular) {
      ctx.beginPath();
      ctx.arc(
        crop.x + crop.width / 2,
        crop.y + crop.height / 2,
        crop.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else {
      ctx.fillRect(crop.x, crop.y, crop.width, crop.height);
    }

    ctx.globalCompositeOperation = 'source-over';
    
    // Draw border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
    ctx.shadowBlur = 10;
    
    if (isCircular) {
      ctx.beginPath();
      ctx.arc(
        crop.x + crop.width / 2,
        crop.y + crop.height / 2,
        crop.width / 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    } else {
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
    }
    
    ctx.shadowBlur = 0;

    // Draw corner handles
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    const handleSize = 12;
    
    const corners = [
      { x: crop.x, y: crop.y },
      { x: crop.x + crop.width, y: crop.y },
      { x: crop.x + crop.width, y: crop.y + crop.height },
      { x: crop.x, y: crop.y + crop.height }
    ];

    corners.forEach(corner => {
      ctx.beginPath();
      ctx.arc(corner.x, corner.y, handleSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }, [imageData, crop, scale, imageOffset, isCircular]);

  useEffect(() => {
    if (imageData) {
      drawCanvas();
    }
  }, [imageData, drawCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): MousePosition => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const isNearCorner = (x: number, y: number, cornerX: number, cornerY: number): boolean => {
    const distance = Math.sqrt(Math.pow(x - cornerX, 2) + Math.pow(y - cornerY, 2));
    return distance < 15;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;
    
    const { x, y } = getMousePos(e);

    // Check corners for resizing
    const corners = [
      { x: crop.x, y: crop.y, cursor: 'nw' },
      { x: crop.x + crop.width, y: crop.y, cursor: 'ne' },
      { x: crop.x + crop.width, y: crop.y + crop.height, cursor: 'se' },
      { x: crop.x, y: crop.y + crop.height, cursor: 'sw' }
    ];

    for (const corner of corners) {
      if (isNearCorner(x, y, corner.x, corner.y)) {
        setIsResizing(corner.cursor);
        setDragStart({ x, y, cropX: crop.x, cropY: crop.y, cropWidth: crop.width, cropHeight: crop.height });
        return;
      }
    }

    // Check if inside crop area for dragging
    const isInside = isCircular
      ? Math.sqrt(Math.pow(x - (crop.x + crop.width / 2), 2) + Math.pow(y - (crop.y + crop.height / 2), 2)) <= crop.width / 2
      : x >= crop.x && x <= crop.x + crop.width && y >= crop.y && y <= crop.y + crop.height;

    if (isInside) {
      setIsDragging(true);
      setDragStart({ x, y, cropX: crop.x, cropY: crop.y, cropWidth: 0, cropHeight: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && !isResizing) return;
    if (!imageData) return;

    const { x, y } = getMousePos(e);
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    if (isDragging) {
      const newX = Math.max(0, Math.min(dragStart.cropX + dx, imageData.width - crop.width));
      const newY = Math.max(0, Math.min(dragStart.cropY + dy, imageData.height - crop.height));
      setCrop(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      const newCrop = { ...crop };
      const minSize = 50;

      if (isResizing === 'se') {
        newCrop.width = Math.max(minSize, Math.min(dragStart.cropWidth + dx, imageData.width - crop.x));
        newCrop.height = isCircular ? newCrop.width : newCrop.width / aspectRatio;
      } else if (isResizing === 'sw') {
        newCrop.x = Math.max(0, dragStart.cropX + dx);
        newCrop.width = dragStart.cropX + dragStart.cropWidth - newCrop.x;
        newCrop.height = isCircular ? newCrop.width : newCrop.width / aspectRatio;
      } else if (isResizing === 'ne') {
        newCrop.width = Math.max(minSize, dragStart.cropWidth + dx);
        const newHeight = isCircular ? newCrop.width : newCrop.width / aspectRatio;
        newCrop.y = Math.max(0, dragStart.cropY + dragStart.cropHeight - newHeight);
        newCrop.height = newHeight;
      } else if (isResizing === 'nw') {
        newCrop.x = Math.max(0, dragStart.cropX + dx);
        newCrop.width = dragStart.cropX + dragStart.cropWidth - newCrop.x;
        const newHeight = isCircular ? newCrop.width : newCrop.width / aspectRatio;
        newCrop.y = Math.max(0, dragStart.cropY + dragStart.cropHeight - newHeight);
        newCrop.height = newHeight;
      }

      // Ensure crop stays within bounds
      if (newCrop.x + newCrop.width > imageData.width) {
        newCrop.width = imageData.width - newCrop.x;
        newCrop.height = isCircular ? newCrop.width : newCrop.width / aspectRatio;
      }
      if (newCrop.y + newCrop.height > imageData.height) {
        newCrop.height = imageData.height - newCrop.y;
        newCrop.width = isCircular ? newCrop.height : newCrop.height * aspectRatio;
      }

      setCrop(newCrop);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const compressToBlob = async (canvas: HTMLCanvasElement, targetSize: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const tryCompression = async (quality: number, scale: number = 1): Promise<Blob | null> => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width * scale;
        tempCanvas.height = canvas.height * scale;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (!tempCtx) return null;
        
        tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
        
        return new Promise((resolve) => {
          tempCanvas.toBlob(
            (blob) => resolve(blob),
            'image/jpeg',
            quality
          );
        });
      };

      const findOptimalCompression = async () => {
        // Start with high quality
        let quality = 0.95;
        let currentScale = 1.0;
        
        while (quality >= 0.5 || currentScale >= 0.5) {
          const blob = await tryCompression(quality, currentScale);
          
          if (blob && blob.size <= targetSize) {
            return blob;
          }
          
          // Reduce quality first
          if (quality > 0.5) {
            quality -= 0.05;
          } else if (currentScale > 0.5) {
            // If quality is at minimum, start reducing scale
            currentScale -= 0.1;
            quality = 0.95; // Reset quality when changing scale
          } else {
            break;
          }
        }
        
        // Last resort: use minimum settings
        const blob = await tryCompression(0.5, 0.5);
        if (blob) return blob;
        
        throw new Error('Unable to compress image to target size');
      };

      findOptimalCompression().then(resolve).catch(reject);
    });
  };

  const handleCrop = async () => {
    if (!imageData) return;
    
    setIsProcessing(true);
    
    try {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      const scaledWidth = imageData.width * scale;
      const scaledHeight = imageData.height * scale;
      const offsetX = (imageData.width - scaledWidth) / 2 + imageOffset.x;
      const offsetY = (imageData.height - scaledHeight) / 2 + imageOffset.y;
      
      // Calculate source coordinates in original image space
      const sourceScaleX = imageData.originalWidth / scaledWidth;
      const sourceScaleY = imageData.originalHeight / scaledHeight;
      
      const sourceX = (crop.x - offsetX) * sourceScaleX;
      const sourceY = (crop.y - offsetY) * sourceScaleY;
      const sourceWidth = crop.width * sourceScaleX;
      const sourceHeight = crop.height * sourceScaleY;
      
      // Set output size (maintain crop box dimensions for better quality)
      tempCanvas.width = crop.width * 2;
      tempCanvas.height = crop.height * 2;

      tempCtx.drawImage(
        imageData.img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      // Compress to ensure it's under 1MB
      const blob = await compressToBlob(tempCanvas, MAX_FILE_SIZE);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onCrop(reader.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Crop and compression failed:', error);
      alert('Failed to process image. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleZoomChange = (newScale: number) => {
    setScale(newScale);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-3xl">
      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Crop & Adjust
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag to reposition • Drag corners to resize • Slide to zoom
          </p>
        </div>
        
        <div ref={containerRef} className="mb-6 flex justify-center bg-gray-900 rounded-xl p-6 shadow-inner">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-move shadow-2xl rounded-lg"
            style={{ maxWidth: '90%', height: 'auto', touchAction: 'none' }}
          />
        </div>

        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Zoom
            </label>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {Math.round(scale * 100)}%
            </span>
          </div>
          <div className="relative h-10 flex items-center">
            <input
              type="range"
              min="100"
              max="200"
              value={scale * 100}
              onChange={(e) => handleZoomChange(Number(e.target.value) / 100)}
              className="zoom-slider w-full"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(scale - 1) * 100}%, #e5e7eb ${(scale - 1) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isProcessing}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </Button>
          <Button onClick={handleCrop} className="flex-1" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply Crop
              </>
            )}
          </Button>
        </div>

        <style>{`
          .zoom-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 6px;
            border-radius: 3px;
            outline: none;
          }
          
          .zoom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
            transition: all 0.2s ease;
          }
          
          .zoom-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 3px 12px rgba(59, 130, 246, 0.6);
          }
          
          .zoom-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
            transition: all 0.2s ease;
          }
          
          .zoom-slider::-moz-range-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 3px 12px rgba(59, 130, 246, 0.6);
          }

          .dark .zoom-slider {
            background: linear-gradient(to right, #3b82f6 0%, #3b82f6 var(--value), #374151 var(--value), #374151 100%);
          }
        `}</style>
      </div>
    </Modal>
  );
};
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';

interface CropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedImageBase64: string) => void;
  onCancel: () => void;
  aspectRatio: number;
}

export default function CropperModal({ imageSrc, onCropComplete, onCancel, aspectRatio }: CropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteLocal = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
      alert("Kırpma işlemi başarısız oldu.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-app-card border border-app-border rounded-xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-app-border bg-app-card">
          <h2 className="text-on-surface font-semibold">Resmi Kırp (Instagram)</h2>
          <button onClick={onCancel} className="text-app-muted hover:text-on-surface transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteLocal}
            onZoomChange={setZoom}
            objectFit="contain"
          />
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-app-border bg-app-card flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-app-muted text-sm whitespace-nowrap"><i className="fa-solid fa-magnifying-glass-minus"></i></span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#00f0ff] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-app-muted text-sm whitespace-nowrap"><i className="fa-solid fa-magnifying-glass-plus"></i></span>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-app-card border border-app-border text-on-surface hover:bg-app-border transition-colors text-sm font-medium"
            >
              İptal
            </button>
            <button 
              onClick={handleSave}
              disabled={isProcessing}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0080ff] text-black font-semibold text-sm transition-all hover:opacity-90 flex items-center gap-2"
            >
              {isProcessing ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Kırpılıyor...</>
              ) : (
                <><i className="fa-solid fa-crop-simple"></i> Kırp ve Uygula</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

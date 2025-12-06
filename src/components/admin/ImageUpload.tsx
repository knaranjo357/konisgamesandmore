import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  id: number;
  imageNumber: number;
  currentUrl: string;
  onUploadSuccess: (url: string) => void;
  onError: (error: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  imageNumber,
  currentUrl,
  onUploadSuccess,
  onError
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const headers = new Headers();
      headers.append("id", id.toString());
      headers.append("img_number", imageNumber.toString());
      
      // Only append the relevant imageUrl header based on image number
      const urlKey = imageNumber === 1 ? "imageUrl" : 
                    imageNumber === 2 ? "imageUrl2" : "imageUrl3";
      headers.append(urlKey, `https://alliasoft.s3.us-east-2.amazonaws.com/konisgamesandmore/${id}_${imageNumber}`);
      
      headers.append("Content-Type", file.type);

      const response = await fetch("https://n8n.alliasoft.com/webhook/upload_image", {
        method: "POST",
        headers: headers,
        body: file
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.text();
      const newUrl = `https://alliasoft.s3.us-east-2.amazonaws.com/konisgamesandmore/${id}_${imageNumber}`;
      onUploadSuccess(newUrl);
    } catch (error) {
      console.error('Upload error:', error);
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>

        {currentUrl && (
          <div className="flex-1 flex items-center gap-2 bg-gray-700 px-4 py-2 rounded">
            <img
              src={currentUrl}
              alt="Preview"
              className="w-8 h-8 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logokonisgames.png';
              }}
            />
            <span className="flex-1 truncate text-sm">{currentUrl}</span>
          </div>
        )}
      </div>

      {uploading && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
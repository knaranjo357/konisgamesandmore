import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';

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
    <div className="relative group w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Zona de Arrastrar/Subir (Falsa, es botón) */}
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`w-full flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden relative ${
          uploading 
            ? 'bg-gray-900/50 border-purple-500/30 opacity-70 pointer-events-none' 
            : currentUrl 
              ? 'bg-gray-950/40 border-gray-700/50 hover:border-indigo-500/50 hover:bg-gray-900/60'
              : 'bg-gray-950/40 border-gray-700 hover:border-purple-500 hover:bg-gray-900/60'
        }`}
      >
        {/* Capa de Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin mb-2" />
            <span className="text-xs font-semibold text-purple-400 tracking-wider">UPLOADING TO AWS...</span>
          </div>
        )}

        {/* Sección Izquierda: Preview o Ícono Vacío */}
        <div className="shrink-0">
          {currentUrl ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700/50 shadow-[0_0_10px_rgba(0,0,0,0.3)] bg-gray-900 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-shadow">
              <img
                src={currentUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logokonisgames.png';
                }}
              />
              <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5 shadow-lg">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-500 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Sección Derecha: Textos y Botón */}
        <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-center">
          {currentUrl ? (
            <>
              <p className="text-sm font-semibold text-gray-200 truncate">
                Image {imageNumber} Uploaded
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5" title={currentUrl}>
                {currentUrl.split('/').pop()}
              </p>
              <p className="text-[10px] font-medium text-indigo-400 mt-2 uppercase tracking-wider group-hover:text-indigo-300 transition-colors">
                Click to replace image
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                Click to browse
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                PNG, JPG or WEBP (Max. 5MB)
              </p>
              <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-[10px] font-medium border border-gray-700/50 group-hover:bg-purple-500/20 group-hover:text-purple-300 group-hover:border-purple-500/30 transition-colors">
                  <Upload className="w-3 h-3 inline mr-1" />
                  Select File
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
import React, { useState } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  section: 'gallery' | 'sponsors' | 'videos';
  label: string;
  accept: string;
  onFileChange: (files: File[], section: string) => void;
}

const FileUploadSection: React.FC<FileUploadProps> = ({
  section,
  label,
  accept,
  onFileChange,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const filePreviews: string[] = [];

      selectedFiles.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          // For videos, we could use a video thumbnail or a placeholder
          setPreviews((prev) => [...prev, '/api/placeholder/320/180']);
        }
      });

      onFileChange(selectedFiles, section);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith(accept.replace('/*', '/'))
    );

    droppedFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        setPreviews((prev) => [...prev, '/api/placeholder/320/180']);
      }
    });

    onFileChange(droppedFiles, section);
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label className="text-right font-medium">{label}</label>
      <div className="col-span-3">
        <label
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            multiple
            accept={accept}
            onChange={handleFileChange}
          />

          {previews.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 p-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {accept === 'video/*' ? 'MP4, WebM up to 100MB' : 'PNG, JPG, GIF up to 10MB'}
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

// Main component that uses FileUploadSection
const FileUploadContainer: React.FC = () => {
  const handleFileChange = (files: File[], section: string) => {
    console.log(`Files for ${section}:`, files);
    // Handle the files as needed
  };

  return (
    <div className="space-y-6">
      <FileUploadSection
        section="gallery"
        label="Gallery Images"
        accept="image/*"
        onFileChange={handleFileChange}
      />
      <FileUploadSection
        section="sponsors"
        label="Sponsors Images"
        accept="image/*"
        onFileChange={handleFileChange}
      />
      <FileUploadSection
        section="videos"
        label="Videos"
        accept="video/*"
        onFileChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploadContainer;
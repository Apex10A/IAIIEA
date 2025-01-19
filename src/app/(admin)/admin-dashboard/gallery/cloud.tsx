import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, FileUp } from 'lucide-react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

export const PaperFlyerUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5 // Default max number of files
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    
    // Limit total files
    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    
    // Generate previews for image files
    const newPreviews = updatedFiles
      .map(file => URL.createObjectURL(file))
      .filter(preview => preview !== null);

    setFiles(updatedFiles);
    setPreviews(newPreviews);
    onFilesChange(updatedFiles);
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
    
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Photo
          <span className="text-gray-500 ml-2">
            (Max {maxFiles} files)
          </span>
        </label>
        <Input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
          id="flyer-upload"
        />
        <label 
          htmlFor="flyer-upload" 
          className="flex items-center cursor-pointer bg-primary text-primary-foreground p-2 rounded"
        >
          <FileUp className="mr-2 h-4 w-4" />
          Upload
        </label>
      </div>

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div 
              key={index} 
              className="relative border rounded overflow-hidden"
            >
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-32 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 rounded-full"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
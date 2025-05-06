'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface UploadFormProps {
  onUpload: (formData: FormData) => Promise<void>;
}

export default function UploadForm({ onUpload }: UploadFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      
      // Create previews for new images
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= index) {
      setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      images.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });
      formData.append('imageCount', images.length.toString());
      formData.append('userId', 'current-user');
      formData.append('userName', 'Current User');

      await onUpload(formData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setImages([]);
      setPreviews([]);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Share Your Outfit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description of your outfit"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {previews.length > 0 && (
          <div className="relative">
            <div className="relative aspect-square">
              <img
                src={previews[currentImageIndex]}
                alt={`Preview ${currentImageIndex + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(currentImageIndex)}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {previews.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex(prev => (prev < previews.length - 1 ? prev + 1 : prev))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                  disabled={currentImageIndex === previews.length - 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {previews.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
} 
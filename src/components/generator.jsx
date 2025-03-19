import { useState } from 'react';
import Navbar from './navbar';

// Simulated image folder (replace this with actual API call if needed)
const imageFolder = [
  '/src/assets/img1.jpeg',
  '/src/assets/img6.jpeg',
  '/src/assets/img10.jpeg',
  '/src/assets/img7.jpeg',
  '/src/assets/img5.jpeg',
  '/src/assets/img1.jpeg',
  '/src/assets/img2.jpeg',
  '/src/assets/img3.jpeg',
  '/src/assets/img4.jpeg',
  '/src/assets/img5.jpeg',
  '/src/assets/img6.jpeg',
  '/src/assets/img7.jpeg',
  '/src/assets/img8.jpeg',
  '/src/assets/img9.jpeg',
  '/src/assets/img10.jpeg',
];

const ImageGenerationPage = () => {
  const [generatedImages, setGeneratedImages] = useState([]);

  // Function to randomly select 10 images
  const generateDataset = () => {
    // Shuffle the images and pick the first 10
    const shuffledImages = [...imageFolder].sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, 10);
    setGeneratedImages(selectedImages);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 overflow-auto p-4">
      <Navbar/>
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Generate Dataset of Images
        </h2>
        <button
          onClick={generateDataset}
          className="w-full md:w-auto bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Generate Dataset
        </button>
        {generatedImages.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {generatedImages.map((image, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={image}
                  alt={`Generated Image ${index + 1}`}
                  className="w-full h-auto max-w-[200px] max-h-[200px] object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerationPage;
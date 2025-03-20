import { useState, useEffect, useRef } from 'react';
import { Upload, Moon, Bell, Info } from 'lucide-react';
import pexelsImage from '../assets/pexels1.jpg'; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Make sure axios is installed

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [storedPrompts, setStoredPrompts] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  // Apply or remove the 'dark' class on the html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Load stored prompts from localStorage on component mount
  useEffect(() => {
    const savedPrompts = JSON.parse(localStorage.getItem('storedPrompts')) || [];
    setStoredPrompts(savedPrompts);
  }, []);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Ensure the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger the hidden file input when upload button is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Send prompt to backend for prediction
  const sendPromptForPrediction = async () => {
    if (prompt.trim() === '') {
      alert('Prompt cannot be empty.');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Send request to your Node.js backend
      const response = await axios.post('http://localhost:8080/api/predict', {
        text: prompt
      });
      
      setPrediction(response.data);
      return true;
    } catch (error) {
      console.error('Error sending prompt for prediction:', error);
      alert(`Failed to get prediction: ${error.response?.data?.error || error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle storing the prompt and sending for prediction
  const handleStorePrompt = async () => {
    const successPrediction = await sendPromptForPrediction();
    
    if (successPrediction) {
      // Store prompt locally
      const updatedPrompts = [...storedPrompts, prompt];
      setStoredPrompts(updatedPrompts);
      localStorage.setItem('storedPrompts', JSON.stringify(updatedPrompts));
      
      // Store prediction in session storage for access on generator page
      sessionStorage.setItem('latestPrediction', JSON.stringify(prediction));
      
      setPrompt('');
      navigate('/generator', { state: { prediction } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
     
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Upload */}
        <div className="bg-purple-100 dark:bg-gray-800 rounded-3xl p-6 transition-colors duration-300">
          <div className="aspect-video bg-white/50 dark:bg-gray-700 rounded-xl flex flex-col items-center justify-center p-8">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"></div>
              <img
                src={uploadedImage || pexelsImage}
                alt="AI visualization"
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
          </div>
          <button
            onClick={triggerFileInput}
            className="w-full mt-4 bg-purple-600 dark:bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Image</span>
          </button>
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Right Section - Prompt Input */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm transition-colors duration-300 flex flex-col">
          <textarea
            className="w-full h-40 p-4 rounded-2xl border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            placeholder="Enter your AI prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleStorePrompt}
            disabled={isLoading}
            className={`mt-4 ${isLoading ? 'bg-gray-400' : 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800'} text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
          >
            <span>{isLoading ? 'Processing...' : 'Analyze Prompt'}</span>
          </button>
          
          {/* Show prediction if available */}
          {prediction && (
            <div className="mt-4 p-4 bg-purple-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Prediction Result:</h3>
              <p className="text-gray-800 dark:text-gray-200">Defect: {prediction.predicted_defect}</p>
              <p className="text-gray-800 dark:text-gray-200">Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-3xl p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Settings</h2>
          <div className="space-y-4">
            {/* Advanced Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <span>Enable Advanced Mode</span>
              </div>
              <button
                onClick={() => setAdvancedMode(!advancedMode)}
                aria-label="Toggle Advanced Mode"
                className={`w-12 h-6 rounded-full transition-colors ${
                  advancedMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-500'
                } relative flex items-center px-0`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    advancedMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <Moon className="w-5 h-5" />
                <span>Dark Theme</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle Dark Mode"
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-500'
                } relative flex items-center px-1`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                aria-label="Toggle Notifications"
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-500'
                } relative flex items-center px-1`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>

            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-3xl p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p>Latest AI Models: Explore the newest advancements in AI technology.</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p>Project Status: All systems are operational.</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p>User Guide: Access comprehensive guides and FAQs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stored Prompts Section (Optional) */}
      {storedPrompts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Stored Prompts</h2>
          <ul className="list-disc list-inside text-gray-900 dark:text-gray-100">
            {storedPrompts.map((storedPrompt, index) => (
              <li key={index}>{storedPrompt}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-purple-600 dark:bg-purple-700 text-white mt-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <p className="hover:underline cursor-pointer">Privacy Policy</p>
              <p className="hover:underline cursor-pointer">Terms of Service</p>
              <p className="hover:underline cursor-pointer">Help Center</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p>Email: support@DataGenie.com</p>
              <p>Phone: +92 333 2525797</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
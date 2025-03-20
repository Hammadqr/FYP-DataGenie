import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Generator = () => {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch prediction data from the backend
    fetch("http://localhost:8080/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "this is the first test prompt for holes and stains" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPredictionData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching prediction:", err);
        setError("Failed to fetch prediction.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Loading prediction results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Model Prediction Results</h1>
          
          <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Primary Prediction</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Predicted Defect</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {predictionData.predicted_defect}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                <p className="text-xl font-medium text-gray-900 dark:text-white">
                  {(predictionData.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">All Predictions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Defect Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {predictionData.top_predictions.map((prediction, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{prediction.label}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{(prediction.probability * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/upload")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;



// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const Generator = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [predictionData, setPredictionData] = useState(null);
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     // First try to get data from location state (direct navigation)
//     const stateData = location.state?.prediction;
    
//     if (stateData) {
//       setPredictionData(stateData);
//       prepareChartData(stateData);
//     } else {
//       // If not available, try to get from session storage (page refresh)
//       const storedData = sessionStorage.getItem('latestPrediction');
//       if (storedData) {
//         const parsedData = JSON.parse(storedData);
//         setPredictionData(parsedData);
//         prepareChartData(parsedData);
//       } else {
//         // No data available, redirect back to upload
//         alert('No prediction data available. Please submit a prompt first.');
//         navigate('/upload');
//       }
//     }
//   }, [location, navigate]);

//   const prepareChartData = (data) => {
//     if (data && data.top_predictions) {
//       const formattedData = data.top_predictions.map(item => ({
//         name: item.label,
//         probability: Math.round(item.probability * 100)
//       }));
//       setChartData(formattedData);
//     }
//   };

//   if (!predictionData) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center p-8">
//           <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-700 dark:text-gray-300">Loading prediction results...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">AI Prediction Results</h1>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-xl">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Primary Prediction</h2>
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Predicted Defect</p>
//                   <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
//                     {predictionData.predicted_defect}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
//                   <div className="flex items-center">
//                     <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
//                       <div 
//                         className="h-full bg-purple-600" 
//                         style={{width: `${predictionData.confidence * 100}%`}}
//                       ></div>
//                     </div>
//                     <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
//                       {(predictionData.confidence * 100).toFixed(1)}%
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-xl">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Prediction Distribution</h2>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={chartData}
//                     margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip formatter={(value) => [`${value}%`, 'Probability']} />
//                     <Bar dataKey="probability" fill="#8884d8" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 bg-gray-100 dark:bg-gray-700 p-6 rounded-xl">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Detailed Results</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
//                 <thead>
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Defect Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Probability</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
//                   {predictionData.top_predictions.map((prediction, index) => (
//                     <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{prediction.label}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{(prediction.probability * 100).toFixed(1)}%</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="mt-8 flex justify-center">
//             <button
//               onClick={() => navigate('/upload')}
//               className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               Submit Another Prompt
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Generator;

// import { useState } from 'react';
// import Navbar from './navbar';

// // Simulated image folder (replace this with actual API call if needed)
// const imageFolder = [
//   '/src/assets/img1.jpeg',
//   '/src/assets/img6.jpeg',
//   '/src/assets/img10.jpeg',
//   '/src/assets/img7.jpeg',
//   '/src/assets/img5.jpeg',
//   '/src/assets/img1.jpeg',
//   '/src/assets/img2.jpeg',
//   '/src/assets/img3.jpeg',
//   '/src/assets/img4.jpeg',
//   '/src/assets/img5.jpeg',
//   '/src/assets/img6.jpeg',
//   '/src/assets/img7.jpeg',
//   '/src/assets/img8.jpeg',
//   '/src/assets/img9.jpeg',
//   '/src/assets/img10.jpeg',
// ];

// const ImageGenerationPage = () => {
//   const [generatedImages, setGeneratedImages] = useState([]);

//   // Function to randomly select 10 images
//   const generateDataset = () => {
//     // Shuffle the images and pick the first 10
//     const shuffledImages = [...imageFolder].sort(() => Math.random() - 0.5);
//     const selectedImages = shuffledImages.slice(0, 10);
//     setGeneratedImages(selectedImages);
//   };

//   return (
//     <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 overflow-auto p-4">
//       <Navbar/>
//       <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-3xl">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
//           Generate Dataset of Images
//         </h2>
//         <button
//           onClick={generateDataset}
//           className="w-full md:w-auto bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
//         >
//           Generate Dataset
//         </button>
//         {generatedImages.length > 0 && (
//           <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//             {generatedImages.map((image, index) => (
//               <div key={index} className="flex justify-center">
//                 <img
//                   src={image}
//                   alt={`Generated Image ${index + 1}`}
//                   className="w-full h-auto max-w-[200px] max-h-[200px] object-cover rounded-lg shadow-md"
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageGenerationPage;
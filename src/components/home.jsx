// import { LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <LayoutGrid className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span className="text-xl font-semibold text-purple-600 dark:text-purple-400">DataGENIE</span>
        </div>
        <div className="flex space-x-6">
          <span onClick={() => navigate('/')} className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">Home</span>
          <span onClick={() => navigate('/generator')} className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">Generator</span>
          <span onClick={() => navigate('/contact')} className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">Contact</span>
        </div>
      </nav> */}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to <span className="text-purple-600">DataGENIE</span>
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          A powerful AI-driven tool for generating and analyzing synthetic datasets.
        </p>
        <button 
          onClick={() => navigate('/generator')}
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;

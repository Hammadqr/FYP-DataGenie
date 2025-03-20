import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for HTTP requests

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // For error messages
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate(); // To navigate after signup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true); 
  
    try {
      // Send signup request to the backend
      await axios.post("http://localhost:8080/api/auth/signup", formData);
      
      alert("Signup successful! You can now log in.");
      navigate("/signin"); 
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-center">{error}</p>} {/* Show error */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

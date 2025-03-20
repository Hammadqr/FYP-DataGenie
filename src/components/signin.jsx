import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8080/api/auth1/signin", {
        email,
        password,
      });
  
      if (response.status === 200) {
        console.log("Login successful!", response.data);
  
        // Store token & user info
        if (response.data.token && response.data.user) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
  
          // Redirect to upload page
          navigate("/home");
        } else {
          setError("Invalid response from server");
        }
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
  
      setError(
        err.response?.data?.message ||
          (err.response?.status === 500
            ? "Server error. Please try again later."
            : "Login failed. Please try again.")
      );
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 w-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Login to Data Genei</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

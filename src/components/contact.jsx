import { LayoutGrid, Mail, Phone } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Contact = () => {
//   const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message Sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      {/* <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 dark:bg-gray-900 shadow-md transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <LayoutGrid className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">DataGENIE</span>
        </div>
        <div className="flex space-x-4">
          <span 
            onClick={() => navigate('/')} 
            className="px-4 py-2 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-purple-600 hover:text-white cursor-pointer transition"
          >
            Home
          </span>
          <span 
            onClick={() => navigate('/generator')} 
            className="px-4 py-2 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-purple-600 hover:text-white cursor-pointer transition"
          >
            Generator
          </span>
          <span 
            onClick={() => navigate('/contact')} 
            className="px-4 py-2 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-purple-600 hover:text-white cursor-pointer transition"
          >
            Contact
          </span>
        </div>
      </nav> */}

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Contact Us</h2>
        <p className="text-center text-gray-700 dark:text-gray-300 mt-2">
          Have any questions? Feel free to reach out!
        </p>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-6 md:space-y-0">
          {/* Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-purple-600" />
              <span className="text-gray-800 dark:text-gray-200">support@datagenie.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-6 h-6 text-purple-600" />
              <span className="text-gray-800 dark:text-gray-200">+1 234 567 890</span>
            </div>
          </div>

          {/* Contact Form */}
          <form className="w-full md:w-2/3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-purple-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-purple-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-purple-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

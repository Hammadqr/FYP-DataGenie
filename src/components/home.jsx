import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Sample image array
const images = [
  { id: 1, src: "/src/assets/img1.jpeg", alt: "Fabric Defect 1" },
  { id: 2, src: "/src/assets/img2.jpeg", alt: "Fabric Defect 2" },
  { id: 3, src: "/src/assets/img3.jpeg", alt: "Fabric Defect 3" },
  { id: 4, src: "/src/assets/img4.jpeg", alt: "Fabric Defect 4" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 van-gogh-pattern">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to <span className="text-purple-600">DataGENIE</span>
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          A powerful AI-driven tool for generating and analyzing synthetic datasets.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Get Started
        </button>
      </div>

      {/* Image Slider Section */}
      <div className="max-w-lg mx-auto px-4 py-10">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={10}
          slidesPerView={1} // Only one slide at a time
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="w-full rounded-lg shadow-lg"
        >
          {images.map((image) => (
            <SwiperSlide key={image.id} className="flex justify-center items-center">
              <div className="w-full h-[300px] flex justify-center items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")} // Hide broken images
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;
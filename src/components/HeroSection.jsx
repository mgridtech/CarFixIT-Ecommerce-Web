import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { getPromotionalBanners } from "../pages/Services/Services.jsx";
import { useNavigate } from "react-router-dom"; // Add this import


const HeroSection = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading

  const handleBannerClick = (productId) => {
    console.log("Clicked product ID:", productId);
    navigate(`/productdetails/${productId}`);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBanners = async () => {
      try {
        const response = await getPromotionalBanners();
        if (isMounted && !response.error && response.data) {
          setSlides(response.data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        if (isMounted) {
          setLoading(false); // Set loading to false after fetching
        }
      }
    };

    fetchBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  // Function to properly format base64 image data
  const getImageSrc = (imageString) => {
    if (!imageString) return "https://via.placeholder.com/1200x400?text=No+Image";

    if (imageString.startsWith("http")) {
      return imageString;
    }

    if (imageString.startsWith("data:image")) {
      return imageString;
    }

    return `data:image/jpeg;base64,${imageString}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#8B1E51]"></div>
      </div>
    );
  }

  return (
    <section className="relative w-full pt-16 mt-6">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={false}
        modules={[Autoplay]}
        className="w-full overflow-hidden"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <img
              src={getImageSrc(slide.image)}
              alt={`Banner ${slide.bannerType}`}
              className="w-full h-auto object-cover cursor-pointer"
              onClick={() => handleBannerClick(slide.productId)} // Add click handler
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getDisplayBanners } from "../pages/Services/Services.jsx";

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await getDisplayBanners();
        if (!response.error) {
          setBanners(response.data);
        } else {
          setError(response.error);
          console.error("Error fetching display banners:", response.error);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error in fetch operation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* <p>Loading banners...</p> */}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-500">Error loading banners: {error}</p>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>No display banners available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#8B1E51] mb-2">
            Explore Our Exclusive Offers
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">
            Discover amazing deals on car services, repairs, and accessories.
            Get the best offers to keep your car in top condition while saving money!
          </p>
        </div>

        {/* Swiper */}
        <div className="mt-8">
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={3}
            spaceBetween={20}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={false}
            pagination={false}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              640: { slidesPerView: 2, spaceBetween: 15 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="pb-6"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center">
                <img
                  src={`data:image/jpeg;base64,${banner.image}`}
                  alt={`Banner ${index + 1}`}
                  className="w-full max-h-[220px] object-cover shadow-md transition-transform duration-300 hover:scale-105 mt-4"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;
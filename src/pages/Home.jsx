import HeroSection from '../components/HeroSection';
import ServiceSection from '../components/ServiceSection';
import EcommerceSection from '../components/EcommerceSection';
import GuaranteedServices from '../components/GuaranteedServices';
import BannerSlider from "../components/BannerSlider";
import DownloadApp from "../components/DownloadApp";
const Home = () => {

  return (
    <div>
      <HeroSection />
      <ServiceSection />
      <EcommerceSection />
      <BannerSlider />
      <GuaranteedServices />
      <DownloadApp />
    </div>
  );
};

export default Home;

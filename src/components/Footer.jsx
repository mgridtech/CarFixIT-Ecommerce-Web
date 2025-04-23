import { Link } from "react-router-dom"; // Import Link from React Router
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-bold">CarFixIt</h2>
          <p className="mt-2 text-gray-400">
            Your trusted car repair and maintenance service.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li>
              <Link to="/" className="hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">About Us</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-white transition">Blog</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex justify-center md:justify-start mt-3 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-2xl">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CarFixIt. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

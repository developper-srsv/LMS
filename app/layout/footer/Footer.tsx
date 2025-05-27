import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Top Categories</h3>
          <ul className="space-y-2">
            <li>Development</li>
            <li>Business</li>
            <li>Finance & Accounting</li>
            <li>IT & Software</li>
            <li>Personal Development</li>
          </ul>
        </div>

        {/* About & Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">About</h3>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Careers</li>
            <li>Press & News</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Contact Us</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <FaFacebook className="text-2xl cursor-pointer hover:text-white" />
            <FaTwitter className="text-2xl cursor-pointer hover:text-white" />
            <FaInstagram className="text-2xl cursor-pointer hover:text-white" />
            <FaLinkedin className="text-2xl cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>
      <div className="text-center mt-8 text-sm border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Udemy Clone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

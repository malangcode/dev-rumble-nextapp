import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold mb-2">SmartCanteen</h2>
          <p className="text-gray-300">
            Your trusted platform for smart food ordering, seamless dining, and real-time menu updates. Elevate your eating experience!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/menu" className="hover:underline">View Menu</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2"><FaMapMarkerAlt /> Kathmandu, Nepal</li>
            <li className="flex items-center gap-2"><FaPhoneAlt /> +977-9876543210</li>
            <li className="flex items-center gap-2"><FaEnvelope /> support@smartcanteen.com</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2 text-xl text-gray-300">
            <Link href="#"><FaFacebook className="hover:text-white" /></Link>
            <Link href="#"><FaInstagram className="hover:text-white" /></Link>
            <Link href="#"><FaTwitter className="hover:text-white" /></Link>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 text-center text-gray-400 text-xs pt-4">
        &copy; {new Date().getFullYear()} SmartCanteen. All rights reserved. Built by <span className="text-white font-semibold">Rahish Sheikh</span>.
      </div>
    </footer>
  );
}

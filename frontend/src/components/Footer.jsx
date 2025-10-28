import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">About MGNREGA</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Guidelines</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Circulars</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">RTI</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Annual Reports</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">State Dashboards</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Photo Gallery</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Ministry of Rural Development, Krishi Bhawan, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>1800-345-6789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@mgnrega.gov.in</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Important Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Data.gov.in</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">MyGov.in</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">India.gov.in</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">UMANG App</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2025 Ministry of Rural Development, Government of India. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Send } from 'lucide-react'
import { imagePaths } from '../utils/imagePaths'

const Footer = () => {
  return (
    <>
      {/* Main Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 - Foodzy Info */}
            <div>
              <div className="flex flex-col mb-4">
                <div className="text-2xl font-bold text-[#1A1A1A] mb-1">Foodzy</div>
                <div className="text-xs text-gray-500">A Treasure of Tastes</div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                FoodTrove is the biggest market of grocery products. Get your daily needs from our store.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>51 Green St.Huntington ohaio beach ontario, NY 11746 KY 4783, USA.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>example@email.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 123 4567890</span>
                </div>
              </div>
            </div>

            {/* Column 2 - Company */}
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-primary-red transition">About Us</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Delivery Information</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Terms & Conditions</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Support Center</Link></li>
              </ul>
            </div>

            {/* Column 3 - Category */}
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Category</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-primary-red transition">Dairy & Bakery</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Fruits & Vegetable</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Snack & Spice</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Juice & Drinks</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Chicken & Meat</Link></li>
                <li><Link to="/" className="hover:text-primary-red transition">Fast Food</Link></li>
              </ul>
            </div>

            {/* Column 4 - Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Subscribe Our Newsletter</h3>
              <div className="flex mb-4">
                <input
                  type="email"
                  placeholder="Search here..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l outline-none text-sm"
                />
                <button className="bg-primary-red text-white px-4 rounded-r hover:bg-red-600 transition">
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-3 mb-4">
                <a href="#" className="w-8 h-8 bg-[#1A1A1A] text-white rounded flex items-center justify-center hover:bg-primary-red transition">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#1A1A1A] text-white rounded flex items-center justify-center hover:bg-primary-red transition">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#1A1A1A] text-white rounded flex items-center justify-center hover:bg-primary-red transition">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#1A1A1A] text-white rounded flex items-center justify-center hover:bg-primary-red transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9zm-1.5-15c-2.485 0-4.5 2.015-4.5 4.5 0 1.726 1.014 3.215 2.47 3.902.028-.25.067-.635.118-1.08l.477-2.029c.018-.08.04-.195.04-.195s-.12-.023-.12-.57c0-.534.31-.933.694-.933.328 0 .486.246.486.605 0 .311-.207.776-.313 1.207l-.118.475c-.038.154-.026.21.114.21.137 0 .368-.207.514-.576.207-.508.357-1.19.357-1.915 0-.792-.432-1.36-1.05-1.36-.715 0-1.288.751-1.288 1.75 0 .636.214 1.068.214 1.068s-.724 3.064-.856 3.64c-.254 1.074-.06 2.39-.03 2.52.015.088.122.108.171.04.078-.11 1.062-1.315 1.399-2.53.095-.389.544-2.68.544-2.68.269.516 1.055.97 1.889.97 2.485 0 4.17-2.609 4.17-6.095C15.5 4.515 13.485 2.5 11 2.5z"/>
                  </svg>
                </a>
              </div>
              <div className="w-full">
                <img
                  src={imagePaths.footer.foodRow}
                  alt="Food items"
                  className="w-full h-auto rounded"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x200?text=Food+Row'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          © 2025 Foodzy. All rights reserved.
        </div>
      </div>
    </>
  )
}

export default Footer


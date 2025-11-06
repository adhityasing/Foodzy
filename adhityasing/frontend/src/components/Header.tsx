import { Link } from 'react-router-dom'
import { Search, User, Heart, ShoppingCart, Menu } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

interface HeaderProps {
  showBreadcrumb?: boolean
  breadcrumbTitle?: string
  breadcrumbPath?: string
}

const Header = ({ showBreadcrumb = false, breadcrumbTitle, breadcrumbPath }: HeaderProps) => {
  const itemCount = useCartStore((state: any) => state.getItemCount())

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1A1A1A] text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5 cursor-pointer" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary-red transition">Home</Link>
            <Link to="/" className="hover:text-primary-red transition">Category</Link>
            <Link to="/" className="hover:text-primary-red transition">Products</Link>
            <Link to="/" className="hover:text-primary-red transition">Pages</Link>
            <Link to="/" className="hover:text-primary-red transition">Blog</Link>
            <Link to="/" className="hover:text-primary-red transition">Elements</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">+123 (456) 7890</span>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary-red transition">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary-red transition">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </div>
            <Link to="/checkout" className="flex items-center gap-1 cursor-pointer hover:text-primary-red transition">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-[#1A1A1A]">Foodzy</div>
                </div>
                <div className="text-xs text-gray-500 -mt-1">A Treasure of Tastes</div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex">
              <div className="flex w-full border border-gray-300 rounded">
                <input
                  type="text"
                  placeholder="Search for items..."
                  className="flex-1 px-4 py-2 outline-none rounded-l"
                />
                <select className="px-4 py-2 border-l border-r border-gray-300 outline-none bg-white">
                  <option>All Category</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Dairy</option>
                  <option>Meat</option>
                </select>
                <button className="bg-primary-red text-white px-6 py-2 rounded-r hover:bg-red-600 transition">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 cursor-pointer">
                <User className="w-6 h-6 text-gray-600" />
                <span className="text-sm">Account</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 cursor-pointer">
                <Heart className="w-6 h-6 text-gray-600" />
                <span className="text-sm">Wishlist</span>
              </div>
              <Link to="/checkout" className="relative flex items-center gap-2 cursor-pointer">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                <span className="text-sm hidden lg:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Banner (if shown) */}
      {showBreadcrumb && (
        <div className="bg-primary-red text-white py-4">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">{breadcrumbTitle}</h1>
            <div className="text-sm">
              {breadcrumbPath || 'Home'} &gt; {breadcrumbTitle}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header


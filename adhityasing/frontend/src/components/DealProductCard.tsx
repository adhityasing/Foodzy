import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

interface DealProductCardProps {
  product: Product
}

const DealProductCard = ({ product }: DealProductCardProps) => {
  const addItem = useCartStore((state: any) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success('Product added to cart!')
  }

  return (
    <Link to={`/product/${product.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow block h-full flex flex-col">
      {/* Product Image - Full Width Top */}
      <div className="relative bg-white w-full">
        {product.tag && (
          <span
            className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded z-10 ${
              product.tag === 'Sale'
                ? 'bg-primary-red'
                : product.tag === 'New'
                ? 'bg-primary-green'
                : 'bg-orange-500'
            }`}
          >
            {product.tag}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square object-contain"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Product'
          }}
        />
      </div>

      {/* White Info Box Below Image */}
      <div className="bg-white border-t border-gray-200 p-4 flex flex-col flex-1 min-h-[100px]">
        {/* Product Name */}
        <h3 className="text-base font-bold text-[#1A1A1A] mb-1.5 line-clamp-2 hover:text-primary-red transition leading-tight">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.rating?.toFixed(1)})
            </span>
          </div>
        )}
        
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-3">By {product.brand}</p>
        )}
        
        {/* Price and Add Button - Bottom Right */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-green">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-primary-red text-white px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-red-600 transition text-sm whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default DealProductCard


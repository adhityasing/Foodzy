import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'
import { getProductImage } from '../utils/imagePaths'

interface ProductCardProps {
  product: Product
  showAddButton?: boolean
  showCategory?: boolean
  hideRating?: boolean
  hideBrand?: boolean
}

const ProductCard = ({ product, showAddButton = true, showCategory = false, hideRating = false, hideBrand = false }: ProductCardProps) => {
  const addItem = useCartStore((state: any) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success('Product added to cart!')
  }

  return (
    <Link to={`/product/${product.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow block h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square bg-white">
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
          src={getProductImage(product.id, product.name) || product.image}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const img = e.target as HTMLImageElement
            if (img.src !== product.image && product.image) {
              img.src = product.image
            } else {
              img.src = 'https://via.placeholder.com/300?text=Product'
            }
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category - shown below image */}
        {showCategory && product.category && (
          <p className="text-xs text-gray-500 mb-2 text-center">{product.category}</p>
        )}
        
        <h3 className={`text-sm ${showCategory ? 'font-bold text-center' : 'font-medium'} text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] hover:text-primary-red transition`}>
          {product.name}
        </h3>
        
        {!hideRating && product.rating && (
          <div className="flex items-center gap-1 mb-2">
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
              ({product.reviewCount || 0} Review)
            </span>
          </div>
        )}
        {!hideBrand && product.brand && (
          <p className="text-xs text-gray-500 mb-2">By {product.brand}</p>
        )}
        <div className={`flex items-center justify-between mb-3 ${showCategory ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#1A1A1A]">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        {showAddButton && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-red text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-red-600 transition mt-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        )}
      </div>
    </Link>
  )
}

export default ProductCard


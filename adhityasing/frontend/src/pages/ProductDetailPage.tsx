import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'
import { useCartStore } from '../store/cartStore'
import { Product } from '../types'
import { Star, Minus, Plus, ArrowUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProductImage } from '../utils/imagePaths'
import { imagePaths } from '../utils/imagePaths'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedWeight, setSelectedWeight] = useState('80kg')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Description')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 20, max: 250 })

  const addItem = useCartStore((state: any) => state.addItem)

  useEffect(() => {
    if (id) {
      loadProduct()
      loadRelatedProducts()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      const data = await productAPI.getById(id!)
      if (data && data.id) {
        setProduct(data)
        if (data.weight) {
          setSelectedWeight(data.weight)
        }
      } else {
        // If API returns empty/invalid data, try fetching all products
        throw new Error('Invalid product data')
      }
    } catch (error) {
      console.error('Failed to load product:', error)
      // Try fetching all products and finding the one with matching ID
      try {
        const allProducts = await productAPI.getAll()
        const foundProduct = allProducts.find((p) => p.id === id || String(p.id) === id)
        if (foundProduct) {
          setProduct(foundProduct)
          if (foundProduct.weight) {
            setSelectedWeight(foundProduct.weight)
          }
          return
        }
      } catch (fetchError) {
        console.error('Failed to fetch all products:', fetchError)
      }
      
      // Try to find the product in mock products array by ID
      const foundProduct = allMockProducts.find((p) => p.id === id || String(p.id) === id)
      if (foundProduct) {
        setProduct(foundProduct)
        if (foundProduct.weight) {
          setSelectedWeight(foundProduct.weight)
        }
      } else {
        // Fallback to default mock product if not found
        console.warn(`Product with id ${id} not found, using default mock product`)
        setProduct({ ...mockProduct, id: id || '1' })
      }
    }
  }

  const loadRelatedProducts = async () => {
    try {
      const data = await productAPI.getAll()
      // Filter products with tags and exclude current product
      let filtered = data.filter((p) => p.tag && p.id !== id).slice(0, 4)
      
      // If we don't have enough products with tags, use mock products as fallback
      if (filtered.length < 4) {
        const mockWithTags = mockPopularProducts.filter((p) => p.tag && p.id !== id).slice(0, 4 - filtered.length)
        filtered = [...filtered, ...mockWithTags].slice(0, 4)
      }
      
      setRelatedProducts(filtered)
    } catch (error) {
      console.error('Failed to load related products:', error)
      // Use mock products as fallback
      const mockFiltered = mockPopularProducts.filter((p) => p.tag && p.id !== id).slice(0, 4)
      setRelatedProducts(mockFiltered)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedWeight)
      toast.success('Product added to cart!')
    }
  }

  const categories = [
    { name: 'Juice & Drinks', count: 20 },
    { name: 'Dairy & Milk', count: 54 },
    { name: 'Snack & Spice', count: 64 },
  ]

  const weightOptions = ['20kg', '80kg', '120kg', '200kg']

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBreadcrumb breadcrumbTitle="Product" breadcrumbPath="Home" />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Product Category */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Product Category</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label key={cat.name} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat.name])
                          } else {
                            setSelectedCategories(selectedCategories.filter((c: string) => c !== cat.name))
                          }
                        }}
                        className="w-4 h-4 text-primary-red rounded"
                      />
                      <span className="text-sm text-gray-600">
                        {cat.name} [{cat.count}]
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter By Price */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Filter By Price</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="20"
                    max="250"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Price: ${priceRange.min} - ${priceRange.max}
                    </span>
                    <button className="bg-primary-red text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition">
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Tags */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Products Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Vegetables', 'Juice', 'Food', 'Dry Fruits', 'Vegetables', 'Juice'].map((tag, index) => (
                    <button
                      key={`${tag}-${index}`}
                      className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:border-primary-red hover:text-primary-red transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Product Content */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-5 gap-8 mb-12">
                {/* Product Image */}
                <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center">
                  <img
                    src={getProductImage(product.id, product.name) || product.image}
                    alt={product.name}
                    className="w-full h-auto max-w-full object-contain rounded"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const img = e.target as HTMLImageElement
                      // Try fallback to product.image if getProductImage fails
                      if (img.src !== product.image && product.image) {
                        img.src = product.image
                      } else {
                        img.src = 'https://via.placeholder.com/500?text=Product'
                      }
                    }}
                  />
                </div>

                {/* Product Details - Extended to the right */}
                <div className="md:col-span-3 space-y-6">
                  {/* Product Name */}
                  <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                    {product.name}
                  </h1>
                  
                  {/* Product Description */}
                  {product.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-orange-400 text-orange-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviewCount || 75} Review)
                    </span>
                  </div>
                  
                  {/* Product Specifications - Table Format */}
                  <div className="border-t border-b border-gray-200 py-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="font-semibold text-[#1A1A1A] w-32">Brand:</span>
                        <span className="text-gray-600">{product.brand || 'ESTA BETTERU CO'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-[#1A1A1A] w-32">Flavour:</span>
                        <span className="text-gray-600">{product.flavour || 'Super Saver Pack'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-[#1A1A1A] w-32">Diet Type:</span>
                        <span className="text-gray-600">{product.dietType || 'Vegetarian'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-[#1A1A1A] w-32">Weight:</span>
                        <span className="text-gray-600">{product.weight || '200 Grams'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-[#1A1A1A] w-32">Speciality:</span>
                        <span className="text-gray-600">{product.speciality || 'Gluten Free, Sugar Free'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-[#1A1A1A] w-32">Info:</span>
                        <span className="text-gray-600">{product.info || 'Egg Free, Allergen-Free'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-[#1A1A1A] w-32">Items:</span>
                        <span className="text-gray-600">{product.items || 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#1A1A1A]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Size/Weight Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Size/Weight:
                    </label>
                    <div className="flex gap-2">
                      {weightOptions.map((weight) => (
                        <button
                          key={weight}
                          onClick={() => setSelectedWeight(weight)}
                          className={`px-4 py-2 rounded text-sm font-medium transition ${
                            selectedWeight === weight
                              ? 'bg-primary-red text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {weight}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-16 text-center border-0 outline-none"
                        min="1"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary-red text-white py-3 rounded font-semibold hover:bg-red-600 transition"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>

            {/* Tabs Section - Below Product Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8">
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6">
                  {['Description', 'Information', 'Review'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 px-2 font-medium transition ${
                        activeTab === tab
                          ? 'text-primary-red border-b-2 border-primary-red'
                          : 'text-gray-600 hover:text-primary-red'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'Description' && (
                  <div className="space-y-6 text-gray-600">
                    {/* Description Text */}
                    <div>
                      <p className="leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error in vero sapiente odio, error dolore vero temporibus consequatur, nobis veniam odit dignissimos consectetur quae in perferendis doloribus debitis corporis, eaque dicta, repellat amet, illum adipisci vel perferendis dolor! Quis vel consequuntur repellat distinctio rem. Corrupti ratione alias odio, error dolore temporibus consequatur, nobis veniam odit laborum dignissimos consectetur quae in perferendis provident quis.
                      </p>
                    </div>
                    
                    {/* Packaging & Delivery Section - Inside Description Tab */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-[#1A1A1A] mb-4 text-lg">Packaging & Delivery</h3>
                      <p className="leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error in vero perferendis dolor! Quis vel consequuntur repellat distinctio rem. Corrupti ratione alias odio, error dolore temporibus consequatur, nobis veniam odit laborum dignissimos consectetur quae in perferendis provident quis.
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === 'Information' && (
                  <div className="text-gray-600">
                    <p>Additional product information will be displayed here.</p>
                  </div>
                )}
                {activeTab === 'Review' && (
                  <div className="text-gray-600">
                    <p>Product reviews will be displayed here.</p>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Popular Products Section - Full Width */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1A1A1A] text-center mb-4">Popular Products</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et viverra maecenas accumsan lacus vel facilisis.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    showAddButton={false}
                    showCategory={true}
                    hideRating={true}
                    hideBrand={true}
                  />
                ))
              ) : (
                // Fallback: Show mock products if API fails
                mockPopularProducts.filter((p) => p.id !== id).slice(0, 4).map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    showAddButton={false}
                    showCategory={true}
                    hideRating={true}
                    hideBrand={true}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-primary-green text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition z-50"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  )
}

const mockProduct: Product = {
  id: '1',
  name: 'Seeds Of Change Oraganic Quinoa, Brown',
  description: 'Premium organic quinoa',
  price: 120.25,
  originalPrice: 123.25,
  image: 'https://via.placeholder.com/500?text=Hazelnut+Chocolate',
  category: 'Snacks',
  brand: 'ESTA BETTERU CO',
  rating: 4.5,
  reviewCount: 75,
  weight: '200 Grams',
  flavour: 'Super Saver Pack',
  dietType: 'Vegetarian',
  speciality: 'Gluten Free, Sugar Free',
  info: 'Egg Free, Allergen-Free',
  items: 1,
}

// All mock products for fallback (matching HomePage mockProducts)
const allMockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh organic villa farm lemon 500gm pack',
    description: 'Fresh organic lemons',
    price: 28.85,
    originalPrice: 32.8,
    image: imagePaths.products.lemon,
    category: 'Fruits',
    brand: 'NestFood',
    rating: 4.0,
    reviewCount: 75,
    tag: 'Hot',
    weight: '500 Grams',
    flavour: 'Fresh',
    dietType: 'Organic',
    speciality: 'Fresh Produce',
    info: 'Farm Fresh',
    items: 1,
  },
  {
    id: '2',
    name: 'Best snakes with hazel nut pack 200gm',
    description: 'Premium hazelnuts',
    price: 52.85,
    originalPrice: 55.8,
    image: imagePaths.products.hazelnut,
    category: 'Snacks',
    brand: 'Stouffer',
    rating: 3.5,
    reviewCount: 50,
    tag: 'Sale',
    weight: '200 Grams',
    flavour: 'Hazelnut',
    dietType: 'Vegetarian',
    speciality: 'Premium Quality',
    info: 'Nut Pack',
    items: 1,
  },
  {
    id: '3',
    name: 'organic fresh venilafarm watermelon',
    description: 'Fresh organic watermelon',
    price: 48.85,
    originalPrice: 52.8,
    image: imagePaths.products.watermelon,
    category: 'Fruits',
    brand: 'Starkist',
    rating: 4.0,
    reviewCount: 60,
    tag: 'New',
    weight: '5kg',
    flavour: 'Natural',
    dietType: 'Organic',
    speciality: 'Farm Fresh',
    info: 'Organic Certified',
    items: 1,
  },
  {
    id: '4',
    name: 'fresh orange apple 1 kg',
    description: 'Fresh organic apples',
    price: 17.85,
    originalPrice: 19.8,
    image: imagePaths.products.apple,
    category: 'Fruits',
    brand: 'NestFood',
    rating: 4.0,
    reviewCount: 80,
    weight: '1 kg',
    flavour: 'Natural',
    dietType: 'Organic',
    speciality: 'Fresh Produce',
    info: 'Farm Fresh',
    items: 1,
  },
  {
    id: '5',
    name: 'Blue Diamond Almonds Lightly Salted',
    description: 'Premium lightly salted almonds, perfect for snacking',
    price: 23.85,
    originalPrice: 25.8,
    image: imagePaths.products['blue-diamond-almonds'],
    category: 'Snacks',
    brand: 'Blue Diamond',
    rating: 4.0,
    reviewCount: 45,
    tag: 'Sale',
  },
  {
    id: '6',
    name: 'Chobani Complete Vanilla Greek Yogurt',
    description: 'Creamy vanilla Greek yogurt with complete nutrition',
    price: 54.85,
    originalPrice: 55.8,
    image: imagePaths.products['mighty-muffin'],
    category: 'Dairy',
    brand: 'Chobani',
    rating: 4.0,
    reviewCount: 30,
  },
  {
    id: '7',
    name: 'Canada Dry Ginger Ale - 2 L Bottle - 200ml - 400g',
    description: 'Refreshing ginger ale beverage',
    price: 32.85,
    originalPrice: 35.8,
    image: imagePaths.products['pistachio-butter'],
    category: 'Beverages',
    brand: 'Canada Dry',
    rating: 4.0,
    reviewCount: 25,
  },
  {
    id: '8',
    name: 'Encore Seafoods Stuffed Alaskan Salmon',
    description: 'Premium stuffed Alaskan salmon',
    price: 35.85,
    originalPrice: 57.8,
    image: imagePaths.products['yuya-niacin'],
    category: 'Seafood',
    brand: 'Encore Seafoods',
    rating: 4.0,
    reviewCount: 15,
    tag: 'Sale',
  },
  {
    id: '9',
    name: 'Gorton\'s Beer Battered Fish Fillets with soft paper',
    description: 'Crispy beer battered fish fillets',
    price: 23.85,
    originalPrice: 25.0,
    image: imagePaths.products['cafe-altura'],
    category: 'Seafood',
    brand: 'Gorton\'s',
    rating: 4.0,
    reviewCount: 70,
    tag: 'Hot',
  },
  {
    id: '10',
    name: 'Haagen-Dazs Caramel Cone Ice Cream Ketchup',
    description: 'Rich caramel cone ice cream',
    price: 22.85,
    originalPrice: 24.8,
    image: imagePaths.products['pukka-latte'],
    category: 'Desserts',
    brand: 'Haagen-Dazs',
    rating: 2.0,
    reviewCount: 10,
  },
  {
    id: '11',
    name: 'All Natural Italian-Style Chicken Meatballs',
    description: 'All natural Italian-style chicken meatballs, perfect for your favorite pasta dishes',
    price: 19.50,
    originalPrice: 30.00,
    image: imagePaths.products['chicken-meatballs'],
    category: 'Meats',
    brand: 'Hodo Foods',
    rating: 4.5,
    reviewCount: 120,
    tag: 'Sale',
  },
  {
    id: '12',
    name: 'Angie\'s Boomchickapop Sweet and Salty',
    description: 'Sweet and salty popcorn snack, perfectly balanced flavor',
    price: 4.99,
    originalPrice: 6.99,
    image: imagePaths.products.boomchickapop,
    category: 'Snacks',
    brand: 'Angie\'s',
    rating: 4.3,
    reviewCount: 85,
    tag: 'Sale',
  },
  {
    id: '13',
    name: 'Foster Farms Takeout Crispy Classic',
    description: 'Crispy classic chicken strips, restaurant quality at home',
    price: 12.99,
    originalPrice: 16.99,
    image: imagePaths.products['foster-farms'],
    category: 'Meats',
    brand: 'Foster Farms',
    rating: 4.6,
    reviewCount: 150,
    tag: 'Hot',
  },
  {
    id: '14',
    name: 'Blue Diamond Almonds Lightly Salted',
    description: 'Premium lightly salted almonds, perfect for snacking',
    price: 8.99,
    originalPrice: 10.59,
    image: imagePaths.products['blue-diamond-almonds'],
    category: 'Snacks',
    brand: 'Blue Diamond',
    rating: 4.4,
    reviewCount: 95,
    tag: 'Sale',
  },
  {
    id: '15',
    name: 'Seeds of Change Organic Quinoa, Brown, & Red Rice',
    description: 'Premium organic quinoa mixed with brown and red rice, perfect for healthy meals',
    price: 32.85,
    originalPrice: 33.8,
    image: imagePaths.products['quinoa-mix'],
    category: 'Grains',
    brand: 'Seeds of Change',
    rating: 4.0,
    reviewCount: 90,
    tag: 'Sale',
  },
  {
    id: '16',
    name: 'Fresh Organic Vegetable Mix',
    description: 'Fresh organic mix of kale, cucumber, and carrots, perfect for salads',
    price: 12.99,
    originalPrice: 15.99,
    image: imagePaths.products['vegetable-mix'],
    category: 'Vegetables',
    brand: 'NestFood',
    rating: 4.5,
    reviewCount: 65,
    tag: 'Hot',
  },
  {
    id: '17',
    name: 'Fresh Citrus Mix',
    description: 'Fresh mix of oranges and lemons, bursting with vitamin C',
    price: 18.85,
    originalPrice: 22.50,
    image: imagePaths.products['citrus-mix'],
    category: 'Fruits',
    brand: 'NestFood',
    rating: 4.3,
    reviewCount: 55,
    tag: 'New',
  },
  {
    id: '18',
    name: 'Fresh Green Peas',
    description: 'Fresh organic green peas, perfect for soups and side dishes',
    price: 9.99,
    originalPrice: 12.99,
    image: imagePaths.products['green-peas'],
    category: 'Vegetables',
    brand: 'NestFood',
    rating: 4.2,
    reviewCount: 40,
    tag: 'Sale',
  },
]

// Mock products with tags for Popular Products section
const mockPopularProducts: Product[] = allMockProducts.filter((p) => p.tag)

export default ProductDetailPage


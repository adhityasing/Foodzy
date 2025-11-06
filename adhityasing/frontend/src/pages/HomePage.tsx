import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import DealProductCard from '../components/DealProductCard'
import { productAPI } from '../services/api'
import { Product } from '../types'
import { ShoppingBag, Truck, Gift, Grid, RotateCcw, ArrowUp, Mail, Tag, Percent } from 'lucide-react'
import { imagePaths } from '../utils/imagePaths'

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productAPI.getAll()
      // Use API data if available and has products, otherwise use mockProducts
      if (data && data.length > 0) {
        setProducts(data)
      } else {
        setProducts(mockProducts)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      // Mock data for development
      setProducts(mockProducts)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ['All', 'Milks & Dairies', 'Coffees & Teas', 'Pet Foods', 'Meats', 'Vegetables', 'Fruits']

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p: Product) => p.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary-red text-white px-4 py-1 rounded text-sm font-semibold mb-4">
                  100% Organic Vegetables
                </span>
                <h1 className="text-5xl font-bold text-[#1A1A1A] mb-6">
                  The best way to stuff your wallet.
                </h1>
                <p className="text-gray-600 mb-8">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet nesciunt illo beatae odio cumque.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded outline-none"
                  />
                  <button className="bg-primary-green text-white px-8 py-3 rounded font-semibold hover:bg-green-600 transition">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                  <img
                    src={imagePaths.hero.freshVegetables}
                    alt="Fresh Vegetables"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=Fresh+Vegetables'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Blocks */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-[#F5E6D3] rounded-lg p-6 relative">
                <div className="flex-1 mb-4">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
                    Everyday Fresh & Clean with Our Products
                  </h3>
                  <button className="bg-primary-red text-white px-6 py-2 rounded hover:bg-red-600 transition">
                    Shop Now
                  </button>
                </div>
                <img 
                  src={imagePaths.promotional.onions} 
                  alt="Onions" 
                  className="absolute bottom-0 right-0 w-40 h-40 object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160?text=Onions'
                  }}
                />
              </div>

              {/* Card 2 */}
              <div className="bg-[#FFE5E5] rounded-lg p-6 relative">
                <div className="flex-1 mb-4">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
                    Make your Breakfast Healthy and Easy
                  </h3>
                  <button className="bg-primary-red text-white px-6 py-2 rounded hover:bg-red-600 transition">
                    Shop Now
                  </button>
                </div>
                <img 
                  src={imagePaths.promotional.smoothie} 
                  alt="Smoothie" 
                  className="absolute bottom-0 right-0 w-40 h-40 object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160?text=Smoothie'
                  }}
                />
              </div>

              {/* Card 3 */}
              <div className="bg-[#E5F3FF] rounded-lg p-6 relative">
                <div className="flex-1 mb-4">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
                    The best Organic Products Online
                  </h3>
                  <button className="bg-primary-red text-white px-6 py-2 rounded hover:bg-red-600 transition">
                    Shop Now
                  </button>
                </div>
                <img 
                  src={imagePaths.promotional.vegetables} 
                  alt="Vegetables" 
                  className="absolute bottom-0 right-0 w-40 h-40 object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160?text=Vegetables'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Popular Products</h2>
              <div className="flex gap-4 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded text-sm font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {isLoading ? (
                <div className="col-span-5 text-center py-12">Loading products...</div>
              ) : (
                filteredProducts.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Daily Best Sells */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Daily Best Sells</h2>
              <a href="#" className="text-gray-600 hover:text-primary-red transition">
                All Deals &gt;
              </a>
            </div>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2 bg-[#1A1A1A] rounded-lg p-8 text-white relative overflow-hidden">
                <div className="mb-4 relative z-10">
                  <h3 className="text-3xl font-bold mb-4">Bring nature into your home.</h3>
                  <button className="bg-primary-red text-white px-6 py-2 rounded hover:bg-red-600 transition">
                    Shop Now
                  </button>
                </div>
                <div className="absolute bottom-0 right-0">
                  <img
                    src={imagePaths.delivery.cooking}
                    alt="Cooking"
                    className="block"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Cooking'
                    }}
                  />
                </div>
              </div>
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.filter((p) => p.tag).slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Deals Of The Day */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Deals Of The Day</h2>
              <a href="#" className="text-gray-600 hover:text-primary-red transition">
                All Deals &gt;
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredProducts.filter((p) => p.tag).slice(0, 4).map((product) => (
                <DealProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-primary-green/10 py-16 relative overflow-hidden">
          {/* Subtle leaf pattern background */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
          }}></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary-green mb-4">
                  Stay home & get your daily needs from our shop.
                </h2>
                <p className="text-primary-green/80 mb-6 text-lg">Start You'r Daily Shopping with Nest Mart.</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded outline-none focus:border-primary-green transition"
                    />
                  </div>
                  <button className="bg-primary-red text-white px-8 py-3 rounded font-semibold hover:bg-red-600 transition whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src={imagePaths.delivery.deliveryPerson}
                  alt="Delivery"
                  className="rounded-lg w-full h-auto"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x400?text=Delivery+Person'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] mb-1 text-base">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.subtitle}</p>
                </div>
              ))}
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

const features = [
  { 
    icon: (
      <div className="relative">
        <Tag className="w-8 h-8 text-primary-green" />
        <span className="absolute -top-1 -right-1 text-xs font-bold text-primary-green">$</span>
      </div>
    ), 
    title: 'Best prices & offers', 
    subtitle: 'Orders $50 or more' 
  },
  { 
    icon: <Truck className="w-8 h-8 text-primary-green" />, 
    title: 'Free delivery', 
    subtitle: '24/7 amazing services' 
  },
  { 
    icon: (
      <div className="relative">
        <Tag className="w-8 h-8 text-primary-green" />
        <Percent className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary-green" />
      </div>
    ), 
    title: 'Great daily deal', 
    subtitle: 'When you sign up' 
  },
  { 
    icon: <ShoppingBag className="w-8 h-8 text-primary-green" />, 
    title: 'Wide assortment', 
    subtitle: 'Mega Discounts' 
  },
  { 
    icon: <RotateCcw className="w-8 h-8 text-primary-green" />, 
    title: 'Easy returns', 
    subtitle: 'Within 30 days' 
  },
]

const mockProducts: Product[] = [
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
  },
  {
    id: '5',
    name: 'Blue Diamond Almonds Lightly Salted Vegetables',
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
    image: imagePaths.products['boomchickapop'],
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

export default HomePage


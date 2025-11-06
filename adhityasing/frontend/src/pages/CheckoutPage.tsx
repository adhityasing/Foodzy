import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { authAPI, orderAPI } from '../services/api'
import { BillingAddress } from '../types'
import { Star, ArrowUp } from 'lucide-react'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const { user, setUser } = useAuthStore()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const [deliveryMethod, setDeliveryMethod] = useState<'free' | 'flat'>('free')
  const [paymentMethod, setPaymentMethod] = useState('')

  const [billingData, setBillingData] = useState<BillingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postCode: '',
    country: '',
    regionState: '',
  })

  const subtotal = getTotal()
  const deliveryCharges = deliveryMethod === 'free' ? 0 : 5
  const total = subtotal + deliveryCharges

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    try {
      await authAPI.sendOTP(email)
      setOtpSent(true)
      toast.success('OTP sent to your email!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter OTP')
      return
    }
    setIsVerifying(true)
    try {
      const response = await authAPI.verifyOTP(email, otp)
      setUser(response.user)
      toast.success('OTP verified successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP')
    } finally {
      setIsVerifying(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please verify your email first')
      return
    }

    if (!billingData.firstName || !billingData.lastName || !billingData.city || !billingData.country) {
      toast.error('Please fill in all required billing fields')
      return
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    try {
      const order = await orderAPI.create(
        items,
        deliveryMethod,
        paymentMethod,
        billingData
      )
      toast.success('Order placed successfully!')
      clearCart()
      navigate(`/order/${order.id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBreadcrumb breadcrumbTitle="Checkout" breadcrumbPath="Home" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-primary-red text-white px-6 py-2 rounded hover:bg-red-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBreadcrumb breadcrumbTitle="Checkout" breadcrumbPath="Home" />

      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Summary, Delivery, Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub-Total</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="font-medium">${deliveryCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Product List */}
                <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedWeight}`} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Product'
                    }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(item.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary-red font-bold">${item.price.toFixed(2)}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Delivery Method</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Please select the preferred shipping method to use on this order.
                </p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="free"
                      checked={deliveryMethod === 'free'}
                      onChange={(e) => setDeliveryMethod(e.target.value as 'free' | 'flat')}
                      className="mt-1 w-4 h-4 text-primary-red"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Free Shipping</div>
                      <div className="text-sm text-gray-600">Rate - $0.00</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="flat"
                      checked={deliveryMethod === 'flat'}
                      onChange={(e) => setDeliveryMethod(e.target.value as 'free' | 'flat')}
                      className="mt-1 w-4 h-4 text-primary-red"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Flat Rate</div>
                      <div className="text-sm text-gray-600">Rate - $5.00</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Payment Method</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Please select the preferred payment method to use on this order.
                </p>
                <div className="space-y-3 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-4 h-4 text-primary-red"
                    />
                    <span className="font-medium">Cash On Delivery</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-4 h-4 text-primary-red"
                    />
                    <span className="font-medium">UPI</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-4 h-4 text-primary-red"
                    />
                    <span className="font-medium">Bank Transfer</span>
                  </label>
                </div>

                {/* Payment Icons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {['Visa', 'PayPal', 'Skrill', 'Mastercard'].map((method) => (
                    <div
                      key={method}
                      className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-600"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Customer & Billing */}
            <div className="space-y-6">
              {/* Customer Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">Customer</h2>
                <p className="text-sm text-gray-600 mb-4">Checkout Options</p>
                
                {!user ? (
                  <div>
                    <h3 className="font-medium mb-4">Returning Customer</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                          />
                          <button
                            onClick={handleSendOTP}
                            className="bg-primary-red text-white px-4 py-2 rounded hover:bg-red-600 transition whitespace-nowrap"
                          >
                            Send OTP
                          </button>
                        </div>
                      </div>
                      {otpSent && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            OTP
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter your OTP"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                              maxLength={6}
                            />
                            <button
                              onClick={handleVerifyOTP}
                              disabled={isVerifying}
                              className="bg-primary-red text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50 whitespace-nowrap"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Logged in as:</p>
                    <p>{user.email}</p>
                  </div>
                )}
              </div>

              {/* Billing Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">Billing Details</h2>
                <p className="text-sm text-gray-600 mb-4">Checkout Options</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-primary-red">*</span>
                      </label>
                      <input
                        type="text"
                        value={billingData.firstName}
                        onChange={(e) =>
                          setBillingData({ ...billingData, firstName: e.target.value })
                        }
                        placeholder="Enter your first name"
                        className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-primary-red">*</span>
                      </label>
                      <input
                        type="text"
                        value={billingData.lastName}
                        onChange={(e) =>
                          setBillingData({ ...billingData, lastName: e.target.value })
                        }
                        placeholder="Enter your last name"
                        className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={billingData.address}
                      onChange={(e) =>
                        setBillingData({ ...billingData, address: e.target.value })
                      }
                      placeholder="Address Line 1"
                      className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-primary-red">*</span>
                      </label>
                      <select
                        value={billingData.city}
                        onChange={(e) =>
                          setBillingData({ ...billingData, city: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                        required
                      >
                        <option value="">City</option>
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="Chicago">Chicago</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post Code
                      </label>
                      <input
                        type="text"
                        value={billingData.postCode}
                        onChange={(e) =>
                          setBillingData({ ...billingData, postCode: e.target.value })
                        }
                        placeholder="Post Code"
                        className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-primary-red">*</span>
                    </label>
                    <select
                      value={billingData.country}
                      onChange={(e) =>
                        setBillingData({ ...billingData, country: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                      required
                    >
                      <option value="">Country</option>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">UK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region State
                    </label>
                    <select
                      value={billingData.regionState}
                      onChange={(e) =>
                        setBillingData({ ...billingData, regionState: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-primary-red"
                    >
                      <option value="">Region/State</option>
                      <option value="California">California</option>
                      <option value="Texas">Texas</option>
                      <option value="Florida">Florida</option>
                    </select>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-primary-red text-white py-3 rounded font-semibold hover:bg-red-600 transition"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default CheckoutPage


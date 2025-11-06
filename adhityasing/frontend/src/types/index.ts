export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand?: string
  rating?: number
  reviewCount?: number
  tag?: 'Sale' | 'New' | 'Hot'
  weight?: string
  flavour?: string
  dietType?: string
  speciality?: string
  info?: string
  items?: number
}

export interface CartItem extends Product {
  quantity: number
  selectedWeight?: string
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  deliveryCharges: number
  total: number
  deliveryMethod: 'free' | 'flat'
  paymentMethod: string
  billingAddress: BillingAddress
  status: string
  createdAt: string
}

export interface BillingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  postCode: string
  country: string
  regionState: string
}

export interface Category {
  id: string
  name: string
  count: number
}


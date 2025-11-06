import axios from 'axios'
import { Product, Order, BillingAddress } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  sendOTP: async (email: string) => {
    const response = await api.post('/auth/send-otp', { email })
    return response.data
  },
  verifyOTP: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp })
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    return response.data
  },
}

export const productAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products')
    return response.data
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get(`/products/category/${category}`)
    return response.data
  },
}

export const orderAPI = {
  create: async (
    items: any[],
    deliveryMethod: string,
    paymentMethod: string,
    billingAddress: BillingAddress
  ): Promise<Order> => {
    const response = await api.post('/orders', {
      items,
      deliveryMethod,
      paymentMethod,
      billingAddress,
    })
    return response.data
  },
  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },
}

export default api


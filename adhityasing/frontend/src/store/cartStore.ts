import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Product } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, selectedWeight?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, selectedWeight) => {
        const items = get().items
        const existingItem = items.find(
          (item) => item.id === product.id && item.selectedWeight === selectedWeight
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.selectedWeight === selectedWeight
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [...items, { ...product, quantity, selectedWeight }],
          })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'foodzy-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)


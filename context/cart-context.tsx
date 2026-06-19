'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

/* =========================
   TYPES
========================= */

export interface CartItem {
  id: string
  slug?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  quantity: number
  size?: string
  color?: string
  sku?: string
}

export interface WishlistItem {
  id: string
  slug?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating?: number
  isNew?: boolean
  isBestseller?: boolean
}

/* =========================
   CONTEXT TYPE
========================= */

interface CartContextType {
  cartItems: CartItem[]
  wishlistItems: WishlistItem[]

  addToCart: (
    item: Omit<CartItem, 'quantity'>,
    quantity?: number,
  ) => void

  removeFromCart: (id: string) => void

  updateQuantity: (
    id: string,
    quantity: number,
  ) => void

  clearCart: () => void

  addToWishlist: (
    item: WishlistItem,
  ) => void

  removeFromWishlist: (
    id: string,
  ) => void

  isInWishlist: (
    id: string,
  ) => boolean

  isInCart: (
    id: string,
  ) => boolean

  cartTotal: number
  cartCount: number
  wishlistCount: number
}

/* =========================
   CONTEXT
========================= */

const CartContext =
  createContext<CartContextType | undefined>(
    undefined,
  )

/* =========================
   PROVIDER
========================= */

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const [cartItems, setCartItems] =
    useState<CartItem[]>([])

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState<WishlistItem[]>([])

  const [isLoaded, setIsLoaded] =
    useState(false)

  /* =========================
     LOAD LOCAL STORAGE
  ========================= */

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(
          'littlebloom_cart',
        )

      const savedWishlist =
        localStorage.getItem(
          'littlebloom_wishlist',
        )

      if (savedCart) {
        setCartItems(
          JSON.parse(savedCart),
        )
      }

      if (savedWishlist) {
        setWishlistItems(
          JSON.parse(savedWishlist),
        )
      }
    } catch (error) {
      console.error(
        'Storage loading error:',
        error,
      )
    } finally {
      setIsLoaded(true)
    }
  }, [])

  /* =========================
     SAVE CART
  ========================= */

  useEffect(() => {
    if (!isLoaded) return

    localStorage.setItem(
      'littlebloom_cart',
      JSON.stringify(cartItems),
    )
  }, [cartItems, isLoaded])

  /* =========================
     SAVE WISHLIST
  ========================= */

  useEffect(() => {
    if (!isLoaded) return

    localStorage.setItem(
      'littlebloom_wishlist',
      JSON.stringify(wishlistItems),
    )
  }, [wishlistItems, isLoaded])

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (
    item: Omit<CartItem, 'quantity'>,
    quantity = 1,
  ) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.color === item.color,
      )

      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.color === item.color
            ? {
                ...i,
                quantity:
                  i.quantity + quantity,
              }
            : i,
        )
      }

      return [
        ...prev,
        {
          ...item,
          quantity,
        },
      ]
    })
  }

  /* =========================
     REMOVE FROM CART
  ========================= */

  const removeFromCart = (
    id: string,
  ) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => item.id !== id,
      ),
    )
  }

  /* =========================
     UPDATE QUANTITY
  ========================= */

  const updateQuantity = (
    id: string,
    quantity: number,
  ) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    )
  }

  /* =========================
     CLEAR CART
  ========================= */

  const clearCart = () => {
    setCartItems([])
  }

  /* =========================
     ADD TO WISHLIST
  ========================= */

  const addToWishlist = (
    item: WishlistItem,
  ) => {
    setWishlistItems((prev) => {
      const alreadyExists =
        prev.find(
          (i) => i.id === item.id,
        )

      if (alreadyExists) {
        return prev
      }

      return [...prev, item]
    })
  }

  /* =========================
     REMOVE FROM WISHLIST
  ========================= */

  const removeFromWishlist = (
    id: string,
  ) => {
    setWishlistItems((prev) =>
      prev.filter(
        (item) => item.id !== id,
      ),
    )
  }

  /* =========================
     CHECK WISHLIST
  ========================= */

  const isInWishlist = (
    id: string,
  ) => {
    return wishlistItems.some(
      (item) => item.id === id,
    )
  }

  /* =========================
     CHECK CART
  ========================= */

  const isInCart = (
    id: string,
  ) => {
    return cartItems.some(
      (item) => item.id === id,
    )
  }

  /* =========================
     TOTALS
  ========================= */

  const cartTotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0,
    )

  const cartCount =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0,
    )

  const wishlistCount =
    wishlistItems.length

  /* =========================
     PROVIDER
  ========================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        addToWishlist,
        removeFromWishlist,

        isInWishlist,
        isInCart,

        cartTotal,
        cartCount,
        wishlistCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

/* =========================
   HOOK
========================= */

export function useCart() {
  const context =
    useContext(CartContext)

  if (context === undefined) {
    throw new Error(
      'useCart must be used within a CartProvider',
    )
  }

  return context
}
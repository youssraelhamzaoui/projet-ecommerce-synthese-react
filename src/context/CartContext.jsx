import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { addToCart, updateCart, removeItem, clearCart, getCart, syncCart } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

const LOCAL_KEY = 'cart_items';

function loadLocalCart() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; } catch { return []; }
}

function saveLocalCart(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart on mount / auth change
  useEffect(() => {
    if (isAuthenticated) {
      const local = loadLocalCart();
      if (local.length > 0) {
        syncCart(local)
          .then(res => { setItems(res.data.items); saveLocalCart(res.data.items); })
          .catch(() => getCart().then(res => setItems(res.data.items)));
      } else {
        getCart().then(res => setItems(res.data.items)).catch(() => {});
      }
    } else {
      setItems(loadLocalCart());
    }
  }, [isAuthenticated]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  const addItem = useCallback(async (product, quantity = 1) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await addToCart({ product_id: product.id, quantity });
        setItems(res.data.items);
        saveLocalCart(res.data.items);
      } else {
        setItems(prev => {
          const found = prev.find(i => i.product_id === product.id);
          const next = found
            ? prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
            : [...prev, { product_id: product.id, nom: product.nom, price: product.prix_actuel, quantity, image: product.image }];
          saveLocalCart(next);
          return next;
        });
      }
      toast.success('Produit ajouté au panier');
    } catch (e) {
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateItem = useCallback(async (productId, quantity) => {
    if (isAuthenticated) {
      const res = await updateCart({ product_id: productId, quantity });
      setItems(res.data.items);
      saveLocalCart(res.data.items);
    } else {
      setItems(prev => {
        const next = quantity === 0
          ? prev.filter(i => i.product_id !== productId)
          : prev.map(i => i.product_id === productId ? { ...i, quantity } : i);
        saveLocalCart(next);
        return next;
      });
    }
  }, [isAuthenticated]);

  const removeFromCart = useCallback(async (productId) => {
    if (isAuthenticated) {
      const res = await removeItem(productId);
      setItems(res.data.items);
      saveLocalCart(res.data.items);
    } else {
      setItems(prev => { const next = prev.filter(i => i.product_id !== productId); saveLocalCart(next); return next; });
    }
    toast.info('Produit retiré du panier');
  }, [isAuthenticated]);

  const emptyCart = useCallback(async () => {
    if (isAuthenticated) {
      await clearCart();
    }
    setItems([]);
    saveLocalCart([]);
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{ items, total, count, loading, addItem, updateItem, removeFromCart, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

import React, { useState } from 'react';
import axios from 'axios';
import Auth from './pages/Auth';
import Home from './pages/Home';

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) {
        return prevCart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  // Database Connection handle karne wala Real Function (Live Link Connected)
  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Kripya order karne se pehle login karein! 🔒");
      return;
    }

    try {
      // FIX: Yahan poora correct backend API absolute endpoint path set kar diya hai
      const res = await axios.post('https://b4a.run', {
        user_id: user.id,
        total_amount: totalAmount,
        cartItems: cart
      });

      alert(res.data.message); // Backend ka success alert
      setCart([]); // Cart empty
      setIsCartOpen(false); // Sidebar close
    } catch (error) {
      console.error("Order fail hua:", error);
      alert(error.response?.data?.message || "Order database me save nahi ho paya!");
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', margin: 0, paddingBottom: '50px', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Sticky Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px 40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#2874f0' }}>⚡ TechStore Pro</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          {user ? (
            <div style={{ fontSize: '15px', color: '#444' }}>
              Welcome, <span style={{ fontWeight: '700', color: '#2874f0' }}>{user.name}</span>
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: '#666', backgroundColor: '#eef2f7', padding: '5px 12px', borderRadius: '6px' }}>🔒 Guest Portal</span>
          )}
          
          <div 
            onClick={() => setIsCartOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2874f0', color: 'white', padding: '10px 22px', borderRadius: '10px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(40, 116, 240, 0.3)', cursor: 'pointer' }}
          >
            <span>🛒 Cart</span>
            <span style={{ backgroundColor: '#fff', color: '#2874f0', borderRadius: '50%', padding: '2px 8px', fontSize: '12px' }}>{totalItems}</span>
          </div>
        </div>
      </nav>

      {/* Main Grid Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {!user && <div style={{ marginTop: '30px' }}><Auth onLoginSuccess={(userData) => setUser(userData)} /></div>}
        {user && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button onClick={() => setUser(null)} style={{ padding: '8px 20px', backgroundColor: '#fff', color: '#d9534f', border: '1px solid #d9534f', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
          </div>
        )}
        <div style={{ marginTop: '40px' }}><Home handleAddToCart={addToCart} /></div>
      </div>

      {/* Sliding Sidebar Cart Menu */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', backgroundColor: '#ffffff', boxShadow: '-5px 0 25px rgba(0,0,0,0.15)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2874f0', color: 'white' }}>
            <h3 style={{ margin: 0 }}>Shopping Cart ({totalItems})</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#777', marginTop: '40px' }}>Aapka cart khali hai! 🛒</p>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ textAlign: 'left' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.name}</h5>
                    <span style={{ fontSize: '13px', color: '#666' }}>₹{item.price} x {item.qty}</span>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ backgroundColor: '#ffebe6', color: '#ff3300', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div style={{ padding: '25px 20px', borderTop: '1px solid #eee', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#222' }}>
                <span>Total Amount:</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                style={{ width: '100%', padding: '14px', backgroundColor: '#ff9f00', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 15px rgba(255,159,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                Place Order 🛍️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

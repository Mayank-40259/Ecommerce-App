import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = ({ handleAddToCart }) => {
    const [products, setProducts] = useState([]);

    // Fallback images pool maps to look super accurate according to item roles
    const imageMap = {
        1: "https://m.media-amazon.com/images/I/61l4YUhUrQL._AC_UY327_FMwebp_QL65_.jpg",// Wireless Mouse
        2: "https://m.media-amazon.com/images/I/81JG5E6nJXL._AC_UY327_FMwebp_QL65_.jpg", // Gaming Keyboard
        3: "https://m.media-amazon.com/images/I/61fLNgXTxVL._AC_UY327_FMwebp_QL65_.jpg", // Noise Cancelling Headphones
        4: "https://m.media-amazon.com/images/I/71zJRygiXvL._AC_UY327_FMwebp_QL65_.jpg", // Amoled Smartwatch
        5: "https://m.media-amazon.com/images/I/81djcVFS+rL._AC_UY327_FMwebp_QL65_.jpg", // 4K Monitor
        6: "https://m.media-amazon.com/images/I/71q+3zoS2OL._AC_UY327_FMwebp_QL65_.jpg", // Mechanical Pro Keyboard
        7: "https://m.media-amazon.com/images/I/71r2ySSfgBL._AC_UL480_FMwebp_QL65_.jpg"  // Ultra Slim Laptop
    };

    useEffect(() => {
        // Yahan localhost ko badalkar humne Back4app ka live live URL jod diya hai
        axios.get('https://b4a.run')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Database connectivity error:", err));
    }, []);

    return (
        <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', borderBottom: '3px solid #2874f0', paddingBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#111' }}>
                    🔥 Live Product Showcases
                </h2>
                <span style={{ fontSize: '13px', backgroundColor: '#2874f0', color: 'white', padding: '6px 14px', borderRadius: '30px', fontWeight: 'bold' }}>
                    {products.length} Gadgets Live
                </span>
            </div>
            
            {/* Interactive Responsive Grid System */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
                {products.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', color: '#777' }}>
                          <p style={{ fontSize: '16px', fontWeight: '600' }}>Connecting database nodes...</p> 
                    </div>
                ) : (
                    products.map(product => (
                        <div 
                            key={product.id} 
                            style={{ 
                                backgroundColor: '#ffffff', 
                                borderRadius: '16px', 
                                overflow: 'hidden', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between', 
                                padding: '20px', 
                                boxShadow: '0 4px 15px rgba(0,0,0,0.04)', 
                                border: '1px solid #eef2f5',
                                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';
                            }}
                        >
                            <span style={{ alignSelf: 'flex-start', backgroundColor: '#e6f0ff', color: '#2874f0', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', marginBottom: '12px' }}>
                                {product.category || 'Gear'}
                            </span>

                            {/* Guaranteed High-Resolution Image Trigger */}
                            <div style={{ height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '10px', marginBottom: '15px' }}>
                                <img 
                                    src={imageMap[product.id] || "https://placehold.co"} 
                                    alt={product.name} 
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://placehold.co{encodeURIComponent(product.name)}`;
                                    }}
                                />
                            </div>

                            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '600', color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {product.name}
                                    </h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111' }}>₹{product.price}</span>
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            style={{ backgroundColor: '#2874f0', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            Add To Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;

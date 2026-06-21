import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? 'login' : 'register';
        
        // डेटा को सही से ऑब्जेक्ट में पैक किया
        const payload = isLogin ? { email, password } : { name, email, password };

        try {
            const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
            setMessage(res.data.message);
            setIsError(false);
            if (isLogin) {
                onLoginSuccess(res.data.user);
            } else {
                setIsLogin(true); // रजिस्टर के बाद लॉगिन स्क्रीन पर भेजें
                setName('');
                setEmail('');
                setPassword('');
            }
       } catch (error) {
           // 👈 Ab static text hatakar asli error ka message print karwayenge
           setMessage(error.response?.data?.message || `Frontend Error: ${error.message}`);
           setIsError(true);
        }

    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '40px 30px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(40, 116, 240, 0.18)', border: '3px solid #2874f0', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2874f0', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 15px', borderRadius: '20px', textTransform: 'uppercase' }}>
                SYSTEM AUTHENTICATION
            </div>

            <h2 style={{ margin: '15px 0 25px 0', fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                {isLogin ? 'Account Sign In' : 'Create Credentials'}
            </h2>
            
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input 
                        style={{ width: '100%', padding: '12px 16px', marginBottom: '15px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccd1d9', fontSize: '14px', backgroundColor: '#333', color: '#fff' }} 
                        type="text" placeholder="Your Full Name" required value={name}
                        onChange={(e) => setName(e.target.value)} 
                    />
                )}
                <input 
                    style={{ width: '100%', padding: '12px 16px', marginBottom: '15px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccd1d9', fontSize: '14px', backgroundColor: '#333', color: '#fff' }} 
                    type="email" placeholder="Your Email Address" required value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    style={{ width: '100%', padding: '12px 16px', marginBottom: '22px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccd1d9', fontSize: '14px', backgroundColor: '#333', color: '#fff' }} 
                    type="password" placeholder="Secure Password" required value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
                
                <button 
                    style={{ width: '100%', padding: '14px', backgroundColor: '#2874f0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 5px 15px rgba(40, 116, 240, 0.4)' }}
                    type="submit"
                >
                    {isLogin ? 'Access Store Account 🔓' : 'Register Secure Profile 🚀'}
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#2874f0', fontWeight: '600', fontSize: '14px' }} onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
                {isLogin ? "New user? Create your account free" : "Already member? Back to login"}
            </p>
            {message && (
                <div style={{ marginTop: '15px', padding: '10px', borderRadius: '6px', backgroundColor: isError ? '#ffebe6' : '#e6fce6', color: isError ? '#cc3300' : '#008000', fontWeight: '600', fontSize: '13px' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Auth;


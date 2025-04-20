import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const IndexPage = () => {
    const navigate = useNavigate();
    console.log("index")

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
    
        if (!authToken) {
            navigate('/guest');
            return;
        }
    
        try {
            const decoded = jwtDecode(authToken);
            const now = Date.now() / 1000;
    
            if (decoded.exp && decoded.exp < now) {
                console.log("Token expired");
                localStorage.removeItem('authToken');
                navigate('/guest');
            } else if (decoded.id?.trim()) {
                navigate('/home');
            } else {
                navigate('/guest');
            }
    
        } catch (err) {
            console.error("Token decode error", err);
            localStorage.removeItem('authToken');
            navigate('/guest');
        }
    }, [navigate]);
    
    return <div></div>;
};

export default IndexPage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const IndexPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
            else {
                if (authToken) {
                    try {
                        const decodedTokenData = jwtDecode(authToken);
                        decodedTokenData.id?.trim() ? navigate('/home') : navigate('/guest')
                    } catch (error) {
                        console.error('Error decoding authToken:', error);
                    }
                }
            }

        }

        return () => { isMounted = false; };
    }, [navigate]);

    return <div></div>;
};

export default IndexPage;

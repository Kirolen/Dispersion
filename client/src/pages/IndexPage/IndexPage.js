import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
    const navigate = useNavigate(); 

    useEffect(() => {
        let isMounted = true; 

        if (isMounted) {
            const token = localStorage.getItem("authToken");
            navigate(token ? "/home" : "/guest");
        }

        return () => { isMounted = false; }; 
    }, [navigate]);

    return <div></div>;
};

export default IndexPage;

import { useState, useEffect } from 'react';

interface LocationData {
    country_code: string;
    country_name: string;
    ip: string;
}

export function useUserLocation() {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isIndian, setIsIndian] = useState(false);

    useEffect(() => {
        const savedCountry = localStorage.getItem('user_country_code');
        if (savedCountry) {
            setLocation({ country_code: savedCountry, country_name: '', ip: '' });
            setIsIndian(savedCountry === 'IN');
            setLoading(false);
            return;
        }

        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.warn('Location detection error:', data.reason);
                    setLoading(false);
                    return;
                }
                const code = data.country_code || data.country;
                setLocation({ ...data, country_code: code });
                const isIN = code === 'IN';
                setIsIndian(isIN);
                localStorage.setItem('user_country_code', code);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch location', err);
                setLoading(false);
            });
    }, []);

    const updateCountry = (countryCode: string) => {
        setLocation(prev => ({ ...prev, country_code: countryCode, country_name: '', ip: '' } as LocationData));
        setIsIndian(countryCode === 'IN');
        localStorage.setItem('user_country_code', countryCode);
    };

    return { location, loading, isIndian, updateCountry };
}

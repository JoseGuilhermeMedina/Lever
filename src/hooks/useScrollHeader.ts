import { useState, useEffect } from 'react';

export function useScrollHeader(threshold = 20) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > threshold);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return scrolled;
}

export function useIntersectionObserver(elementId: string) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            { threshold: 0.1 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [elementId]);

    return isIntersecting;
}

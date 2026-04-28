import { useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Update ScrollTrigger if GSAP is used later
        // lenis.on('scroll', ScrollTrigger.update);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}

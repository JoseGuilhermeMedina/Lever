import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export function usePageTransition() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.hash && anchor.origin === window.location.origin) {
                e.preventDefault();
                const targetId = anchor.hash;
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    gsap.to(window, {
                        duration: 1.2,
                        scrollTo: { y: targetId, autoKill: false },
                        ease: "power4.inOut"
                    });
                }
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);
}

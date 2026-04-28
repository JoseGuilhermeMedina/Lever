import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useHeroParallax(heroRef: React.RefObject<any>) {
    useEffect(() => {
        if (!heroRef.current) return;

        const ctx = gsap.context(() => {
            // Camada 1: Vídeo de Fundo (Muito lento)
            gsap.to('.parallax-bg', {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Camada 2: Overlay de Vinheta/Noise (Lento)
            gsap.to('.vignette-overlay', {
                yPercent: 25,
                opacity: 0.8,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Camada 3: Floating Blobs (Velocidade Média)
            gsap.to('.parallax-float', {
                yPercent: -40,
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });

            // Camada 4: Badges e Cards (Mais rápido)
            gsap.to('.parallax-badges', {
                yPercent: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8,
                },
            });

            // Camada 5: Headline e CTAs (Velocidade Real)
            gsap.to('.parallax-content', {
                yPercent: 10,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'center top',
                    scrub: 0.5,
                },
            });
        }, heroRef);

        return () => ctx.revert(); // Cleanup robusto para React 18
    }, [heroRef]);
}

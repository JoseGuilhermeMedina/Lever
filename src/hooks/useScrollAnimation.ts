import { useRef, useEffect, useState } from 'react';

/**
 * Hook de scroll animation reutilizável.
 *
 * Detecta quando o elemento alvo entra na viewport usando IntersectionObserver
 * e retorna `isVisible: true` uma única vez. Útil para disparar animações CSS
 * ou classes de entrada sem depender de framer-motion.
 *
 * Preferência: use framer-motion `whileInView` diretamente nos componentes
 * (já adotado no projeto). Este hook existe para casos fora do JSX animado
 * (ex: canvas, Three.js, lógica imperativa).
 *
 * @param threshold - Porcentagem visível para disparar (default: 0.15 = 15%)
 * @param margin    - Margem de trigger em px (default: "-60px")
 *
 * @example
 * const { ref, isVisible } = useScrollAnimation();
 * return <div ref={ref} className={isVisible ? 'fade-in' : 'opacity-0'} />;
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    threshold = 0.15,
    margin = '-60px'
) {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // dispara apenas uma vez
                }
            },
            {
                threshold,
                rootMargin: margin,
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, margin]);

    return { ref, isVisible };
}

/**
 * Variantes padronizadas para framer-motion (importar onde necessário).
 * Consolida os padrões de timing do banco de referência.
 */
export const scrollVariants = {
    /** Fade + slide-up para cabeçalhos de seção */
    heading: {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
    },
    /** Container pai para stagger */
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    },
    /** Cards e itens filhos */
    card: {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' as const },
        },
    },
    /** Items menores (listas, FAQs) */
    item: {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    },
    /** Slide da esquerda */
    slideLeft: {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
    },
    /** Slide da direita */
    slideRight: {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
    },
} as const;

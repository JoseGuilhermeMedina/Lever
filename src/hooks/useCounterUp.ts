import { useEffect, useRef, useState, useMemo } from 'react';

/**
 * useCounterUp — anima um número de 0 até `target` quando entra na viewport.
 *
 * Suporta prefixo ("+", "R$ ") e sufixo ("h", "k").
 * Para valores não numéricos (ex: "24h") retorna o valor final direto
 * após um pequeno delay visual para consistência de stagger.
 *
 * @param target     - String do valor final, e.g. "+27", "24h", "R$ 300"
 * @param duration   - Duração da animação em ms (default: 1800)
 * @param startDelay - Delay antes de iniciar em ms (default: 0)
 */
export function useCounterUp(target: string, duration = 1800, startDelay = 0) {
    const [displayValue, setDisplayValue] = useState('0');
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);
    const rafRef = useRef<number | null>(null);

    // extrai partes numéricas e não-numéricas - memorizado para evitar loops de render
    const parsed = useMemo(() => parseTarget(target), [target]);

    // IntersectionObserver — dispara uma única vez
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // animação do contador
    useEffect(() => {
        if (!isVisible) return;
        if (!parsed.numeric) {
            // valor não numérico: aparece direto após delay
            const t = setTimeout(() => setDisplayValue(target), startDelay);
            return () => clearTimeout(t);
        }

        const delay = setTimeout(() => {
            const startTime = performance.now();
            const endValue = parsed.numeric!;

            const tick = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easing: ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * endValue);
                setDisplayValue(`${parsed.prefix}${current}${parsed.suffix}`);

                if (progress < 1) {
                    rafRef.current = requestAnimationFrame(tick);
                } else {
                    setDisplayValue(target); // garante valor exato no final
                }
            };

            rafRef.current = requestAnimationFrame(tick);
        }, startDelay);

        return () => {
            clearTimeout(delay);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isVisible, target, duration, startDelay, parsed]);

    return { ref, displayValue };
}

/* ── helpers ── */
interface ParsedTarget {
    prefix: string;
    numeric: number | null;
    suffix: string;
}

function parseTarget(raw: string): ParsedTarget {
    // Tenta extrair número da string, com prefixo/sufixo
    // e.g. "+27" → prefix "+", numeric 27, suffix ""
    // e.g. "R$ 300" → prefix "R$ ", numeric 300, suffix ""
    // e.g. "+500" → prefix "+", numeric 500, suffix ""
    // e.g. "24h" → não numérico livre
    const match = raw.match(/^([^0-9]*)(\d+(?:[.,]\d+)?)([^0-9]*)$/);
    if (!match) return { prefix: '', numeric: null, suffix: '' };

    const numStr = match[2].replace(',', '.');
    const numeric = parseFloat(numStr);
    if (isNaN(numeric)) return { prefix: '', numeric: null, suffix: '' };

    return {
        prefix: match[1],
        numeric,
        suffix: match[3],
    };
}

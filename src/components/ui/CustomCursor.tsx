import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CustomCursor() {
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(true);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 250 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (isHidden) setIsHidden(false);

            // Verifica se o elemento sob o mouse é link/botão ou tem cursor pointer
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                !!target.closest('button') ||
                !!target.closest('a') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsPointer(isClickable);
        };

        const handleMouseLeave = () => setIsHidden(true);
        const handleMouseEnter = () => setIsHidden(false);

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [mouseY, mouseX, isHidden]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
            {/* Círculo Principal */}
            <motion.div
                className="absolute w-8 h-8 rounded-full border border-cyan/50 mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 2.5 : 1,
                    backgroundColor: isPointer ? 'rgba(79,180,215, 0.2)' : 'rgba(79,180,215, 0)',
                    borderWidth: isPointer ? '0px' : '1.5px',
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />

            {/* Ponto Central (Rastro) */}
            <motion.div
                className="absolute w-1.5 h-1.5 bg-cyan rounded-full mix-blend-difference"
                style={{
                    left: mouseX,
                    top: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    opacity: isHidden ? 0 : 1,
                    scale: isPointer ? 0 : 1,
                }}
            />
        </div>
    );
}

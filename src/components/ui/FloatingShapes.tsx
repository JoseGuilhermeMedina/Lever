import { motion } from 'framer-motion';

export function FloatingShapes() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen">
            {/* Soft Cyan Blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan/10 blur-[120px]"
            />

            {/* Soft Navy/Teal Blur */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1.2, 1, 1.2],
                    x: [0, -40, 0],
                    y: [0, 50, 0]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-navy/5 blur-[120px]"
            />

            {/* Accent Gold Blur */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1],
                    x: [0, 30, 0],
                    y: [0, -30, 0]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-gold/5 blur-[100px]"
            />
        </div>
    );
}

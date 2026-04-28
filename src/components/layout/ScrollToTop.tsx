import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollHeader } from '../../hooks/useScrollHeader';
import { Button } from '../ui/button';

export function ScrollToTop() {
    const scrolled = useScrollHeader(300);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {scrolled && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-24 right-6 z-50"
                >
                    <Button
                        onClick={scrollToTop}
                        size="icon"
                        className="rounded-full bg-navy text-white hover:bg-teal shadow-lg h-12 w-12"
                        title="Voltar ao topo"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

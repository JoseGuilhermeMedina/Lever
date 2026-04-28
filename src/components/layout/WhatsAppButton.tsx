import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildWhatsAppURL } from '../../lib/utils';
import { useIntersectionObserver } from '../../hooks/useScrollHeader';
import { WHATSAPP_NUMBER } from '../../config/constants';

export function WhatsAppButton() {
    const isContactVisible = useIntersectionObserver('contato');
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || WHATSAPP_NUMBER;
    const whatsappUrl = buildWhatsAppURL(whatsappNumber, 'Olá! Gostaria de fazer uma cotação.');

    return (
        <AnimatePresence>
            {!isContactVisible && (
                <motion.a
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-[100] bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center group"
                    title="Fale Conosco"
                >
                    <MessageCircle className="w-8 h-8" />
                    {/* Opcional: Pulse animation para chamar atenção */}
                    <span className="absolute w-full h-full rounded-full bg-green-500 opacity-50 animate-ping -z-10" />
                </motion.a>
            )}
        </AnimatePresence>
    );
}

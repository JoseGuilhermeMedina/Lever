import { Menu, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useScrollHeader } from '../../hooks/useScrollHeader';
import { buildWhatsAppURL, cn } from '../../lib/utils';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../../config/constants';

const NAV_LINKS = [
    { label: 'Produtos', href: '#categorias' },
    { label: 'Catálogo', href: '/catalogo', isPage: true },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
];

export function Header() {
    const scrolled = useScrollHeader();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || WHATSAPP_NUMBER;
    const whatsappUrl = buildWhatsAppURL(whatsappNumber, 'Olá, gostaria de conhecer mais sobre os produtos.');

    const getHref = (href: string, isPage?: boolean) => {
        if (isPage) return href;
        return isHome ? href : `/${href}`;
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled || !isHome ? 'glass-header py-3 shadow-sm' : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <img
                        src="/Logo_lever.png"
                        alt="Lever Logo"
                        className={cn(
                            "h-10 md:h-14 w-auto object-contain transition-all group-hover:scale-105",
                            (!scrolled && isHome) && "brightness-0 invert"
                        )}
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        link.isPage ? (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={cn(
                                    "text-sm font-semibold transition-colors",
                                    scrolled || !isHome ? "text-slate-600 hover:text-cyan" : "text-white/80 hover:text-white"
                                )}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.href}
                                href={getHref(link.href)}
                                className={cn(
                                    "text-sm font-semibold transition-colors",
                                    scrolled || !isHome ? "text-slate-600 hover:text-cyan" : "text-white/80 hover:text-white"
                                )}
                            >
                                {link.label}
                            </a>
                        )
                    ))}
                </nav>

                {/* CTAs */}
                <div className="flex items-center gap-4">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hidden md:block">
                        <Button className="bg-cyan hover:bg-teal text-white font-bold rounded-lg shadow-sm group">
                            <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Falar no WhatsApp
                        </Button>
                    </a>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className={scrolled || !isHome ? "text-navy" : "text-white"} aria-label="Abrir menu">
                                <Menu className="w-7 h-7" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85%] max-w-[350px] flex flex-col pt-20 border-l-0 shadow-2xl">
                            <nav className="flex flex-col gap-4">
                                {NAV_LINKS.map((link) => (
                                    link.isPage ? (
                                            <Link
                                                key={link.href}
                                                to={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="text-lg font-black uppercase tracking-widest text-navy py-4 border-b border-silver/50 transition-all active:pl-4"
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a
                                                key={link.href}
                                                href={getHref(link.href)}
                                                onClick={() => setIsOpen(false)}
                                                className="text-lg font-black uppercase tracking-widest text-navy py-4 border-b border-silver/50 transition-all active:pl-4"
                                            >
                                                {link.label}
                                            </a>
                                        )
                                    ))}
                                </nav>
                                <div className="mt-auto pb-12">
                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-[#5ba344] hover:bg-[#4d8b3a] text-white font-black h-16 uppercase tracking-widest shadow-xl">
                                            <MessageCircle className="w-5 h-5 mr-3 fill-white" />
                                            WhatsApp
                                        </Button>
                                    </a>
                                </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

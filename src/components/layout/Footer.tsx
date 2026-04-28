import { Facebook, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy text-silver py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

                    <div className="space-y-4">
                        <img
                            src="/Logo_lever.png"
                            alt="Lever Logo"
                            className="h-14 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                        />
                        <p className="text-sm text-slate-300 max-w-xs">
                            Distribuidora especializada em produtos de higiene e limpeza profissional para o setor corporativo. Atendendo Salvador e Região Metropolitana.
                        </p>
                        <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white">
                            Fundada em 1998
                        </span>
                    </div>

                    {/* Links Rápidos */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Links Rápidos</h3>
                        <ul className="flex flex-col gap-2">
                            <li><a href="#hero" className="hover:text-cyan transition-colors text-sm">Início</a></li>
                            <li><a href="#categorias" className="hover:text-cyan transition-colors text-sm">Categorias</a></li>
                            <li><a href="#catalogo" className="hover:text-cyan transition-colors text-sm">Catálogo Completo</a></li>
                            <li><a href="#sobre" className="hover:text-cyan transition-colors text-sm">Nossa História</a></li>
                            <li><a href="#faq" className="hover:text-cyan transition-colors text-sm">Perguntas Frequentes</a></li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Contato</h3>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-center gap-3 text-sm">
                                <MessageCircle className="w-4 h-4 text-cyan" />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-cyan" />
                                <span>leverltda@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-cyan mt-1 flex-shrink-0" />
                                <span>Salvador - BA<br />Atendimento Empresarial</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                        &copy; {currentYear} LEVER Distribuidora. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-silver hover:text-white rounded-full">
                            <Instagram className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-silver hover:text-white rounded-full">
                            <Facebook className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

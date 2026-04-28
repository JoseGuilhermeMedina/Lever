import { useState } from 'react';
import { WHATSAPP_NUMBER } from '../../config/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageCircle, Mail, MapPin, Loader2 } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { buildWhatsAppURL } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const formSchema = z.object({
    name: z.string().min(2, 'Nome é obrigatório.'),
    phone: z.string().min(10, 'Telefone inválido.'),
    email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
    company_type: z.string().min(1, 'Selecione o tipo de empresa.'),
    message: z.string().optional(),
});

export function ContactSection() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || WHATSAPP_NUMBER;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            company_type: '',
            message: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Registrar no Supabase (silencioso, não bloquear)
            const { error } = await supabase.from('leads').insert([
                {
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    company_type: values.company_type,
                    message: values.message,
                }
            ]);

            if (error) {
                console.error('Supabase insert error', error);
                // Não jogamos erro para o usuário ainda, tentamos redirecionar via WA
            }

            toast({
                title: "Mensagem pronta! Redirecionando para o WhatsApp...",
                className: "bg-teal text-white",
            });

            const wppText = `Olá! Sou ${values.name} (${values.company_type}).\n\n${values.message ? `Mensagem: ${values.message}` : 'Gostaria de falar com um especialista.'}`;
            window.open(buildWhatsAppURL(whatsappNumber, wppText), '_blank');

            form.reset();
        } catch (error) {
            toast({
                title: "Erro ao enviar.",
                description: "Você pode tentar nos chamar diretamente no WhatsApp.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section id="contato" className="py-16 md:py-24 bg-navy text-white scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Formulário */}
                    <div className="bg-white text-navy p-8 md:p-10 rounded-2xl shadow-2xl">
                        <h3 className="text-2xl font-bold mb-2">Solicite um Orçamento</h3>
                        <p className="text-slate-500 mb-8 font-medium">Preencha os dados e fale com nossa equipe via WhatsApp instantaneamente.</p>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-navy">Nome ou Empresa *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Sílvio / Condomínio X" className="bg-ice" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-navy">WhatsApp *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(71) 90000-0000" className="bg-ice" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="company_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-navy">Perfil *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-ice">
                                                            <SelectValue placeholder="Selecione o perfil" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="condominio">Condomínio</SelectItem>
                                                        <SelectItem value="clinica">Clínica / Hospital</SelectItem>
                                                        <SelectItem value="empresa">Empresa / Indústria</SelectItem>
                                                        <SelectItem value="outro">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-navy">Itens de interesse (Opcional)</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-ice px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Quais produtos você busca?"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isLoading} className="w-full bg-cyan hover:bg-teal text-white h-14 text-base font-bold shadow-lg shadow-cyan/20">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <MessageCircle className="w-5 h-5 mr-2" />}
                                    Enviar e Falar no WhatsApp
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Info de Contato */}
                    <div className="flex flex-col justify-center space-y-10 lg:pl-12">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                                Pronto para otimizar suas compras?
                            </h2>
                            <p className="text-slate-300 text-lg max-w-md">
                                Evite ficar sem estoque. Fale conosco para garantir entrega pontual e os melhores preços do setor.
                            </p>
                        </div>

                        <div className="border-t border-white/20 pt-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-6 h-6 text-cyan" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">WhatsApp de Vendas</h4>
                                    <a href={buildWhatsAppURL(whatsappNumber, 'Olá')} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                                        (71) 99106-8208
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-cyan" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Área de Cobertura</h4>
                                    <p className="text-slate-300 max-w-[250px]">
                                        Salvador e Região Metropolitana (Entrega Direta). Demais cidades (Transportadora FOB).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-cyan" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">E-mail</h4>
                                    <p className="text-slate-300">
                                        leverltda@gmail.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-8">
                            <p className="text-sm font-semibold text-gold mb-1">Aviso de Pedido</p>
                            <p className="text-sm text-slate-300">Pedido mínimo de R$ 300,00 para Salvador/RMS e R$ 600,00 para demais localidades na Bahia.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

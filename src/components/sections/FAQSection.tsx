import { faqs } from '../../data/faq';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { motion } from 'framer-motion';

const headingVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export function FAQSection() {
    return (
        <section id="faq" className="py-24 md:py-32 bg-ice relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Lado Esquerdo: Headline fixa/sticky */}
                    <motion.div
                        className="lg:col-span-5 lg:sticky lg:top-32"
                        variants={headingVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <span className="text-cyan font-bold tracking-[0.2em] text-xs uppercase block mb-6">
                            Suporte & Dúvidas
                        </span>
                        <h2 className="fluid-section-title font-extrabold text-navy leading-[1.1] mb-8">
                            Tudo o que você <br />
                            <span className="font-serif italic text-cyan">precisa saber</span> <br />
                            sobre a LEVER.
                        </h2>
                        <div className="w-20 h-1 bg-cyan opacity-30 mt-8 mb-4 hidden lg:block" />
                        <p className="text-slate-500 font-medium max-w-sm">
                            Nossa operação é desenhada para a máxima transparência.
                            Caso não encontre sua resposta, fale conosco no WhatsApp.
                        </p>
                    </motion.div>

                    {/* Lado Direito: Accordion editorial */}
                    <motion.div
                        className="lg:col-span-7"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, idx) => (
                                <motion.div key={idx} variants={itemVariants}>
                                    <AccordionItem value={`item-${idx}`} className="border-none bg-white rounded-3xl px-8 py-2 shadow-sm hover:shadow-md transition-shadow group">
                                        <AccordionTrigger className="text-left font-bold text-navy fluid-body hover:no-underline group-data-[state=open]:text-cyan transition-colors py-6">
                                            <div className="flex items-start gap-6">
                                                <span className="text-lg font-serif italic text-cyan opacity-40 shrink-0">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <span className="leading-tight">{faq.question}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 fluid-body leading-relaxed pl-14 pb-8 pr-4">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

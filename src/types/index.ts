

export type CategoryID = 'limpeza' | 'equipamentos' | 'quimicos' | 'descartaveis' | 'higiene' | 'industrial';

export type Badge = 'Mais Vendido' | 'Concentrado' | 'Pronto Uso' | 'Uso Industrial' | 'Caixa Master' | 'Oferta' | 'Lançamento' | 'Uso Profissional' | 'Linha Completa' | 'Design Premium' | 'Marcas Parceiras';

export interface Product {
    id: string;
    name: string;
    category: CategoryID;
    description: string;
    imageUrl?: string;
    images?: string[];
    cssClass?: string;
    badges: Badge[];
    isFeatured: boolean;
    isActive: boolean;
    specs?: { label: string; value: string }[];
    whatsappText?: string;
}

export interface Category {
    id: CategoryID;
    label: string;
    icon: any; // Type as appropriate, e.g. LucideIcon
    description?: string;
}

export interface Lead {
    id?: string;
    name: string;
    phone: string;
    email?: string;
    company_type: string;
    message?: string;
    created_at?: string;
}

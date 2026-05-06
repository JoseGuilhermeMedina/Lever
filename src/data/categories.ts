import type { Category } from '../types';
import { Droplets, Trash2, Coffee, Tag } from 'lucide-react';

export const categories: Category[] = [
    { id: 'limpeza', label: 'Limpeza e Higiene', icon: Droplets },
    { id: 'descartaveis', label: 'Descartáveis', icon: Trash2 },
    { id: 'copa', label: 'Copa', icon: Coffee },
    { id: 'promocoes', label: 'PROMOÇÕES', icon: Tag },
];

import type { Category } from '../types';
import { Droplets, Settings2, FlaskConical, Trash2, HandMetal, Factory } from 'lucide-react';

export const categories: Category[] = [
    { id: 'limpeza', label: 'Produtos de Limpeza', icon: Droplets },
    { id: 'equipamentos', label: 'Equipamentos', icon: Settings2 },
    { id: 'quimicos', label: 'Químicos', icon: FlaskConical },
    { id: 'descartaveis', label: 'Descartáveis', icon: Trash2 },
    { id: 'higiene', label: 'Higiene Pessoal', icon: HandMetal },
    { id: 'industrial', label: 'Linha Industrial', icon: Factory },
];

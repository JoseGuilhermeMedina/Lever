import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CategoryID } from '../types';

interface CategoryContextType {
    selectedCategory: CategoryID | 'all';
    setSelectedCategory: (c: CategoryID | 'all') => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [selectedCategory, setSelectedCategory] = useState<CategoryID | 'all'>('all');
    return (
        <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategoryFilter() {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategoryFilter must be used within a CategoryProvider');
    }
    return context;
}

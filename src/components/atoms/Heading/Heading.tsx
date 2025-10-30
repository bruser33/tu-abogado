import type { ReactNode, ElementType } from 'react';

type Props = {
    level?: 1 | 2 | 3;
    children: ReactNode;
    className?: string;
};

export default function Heading({ level = 1, children, className = '' }: Props) {
    const tagByLevel: Record<1 | 2 | 3, 'h1' | 'h2' | 'h3'> = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
    };

    // Tipamos explícitamente como ElementType para JSX
    const Tag = tagByLevel[level] as ElementType;

    const sizes: Record<1 | 2 | 3, string> = {
        1: 'text-3xl md:text-5xl',
        2: 'text-2xl md:text-3xl',
        3: 'text-xl md:text-2xl',
    };

    return (
        <Tag className={`heading font-extrabold text-slate-900 ${sizes[level]} ${className}`}>
            {children}
        </Tag>
    );
}


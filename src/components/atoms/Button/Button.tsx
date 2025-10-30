import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
    full?: boolean;
}

export default function Button({ variant='primary', full, className='', ...props }: Props) {
    const base =
        'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-600',
        secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400',
    };

    const sizing = 'px-5 py-3 text-sm md:text-base';
    const width = full ? 'w-full' : '';

    return (
        <button
            className={`${base} ${variants[variant]} ${sizing} ${width} ${className}`}
            {...props}
        />
    );
}

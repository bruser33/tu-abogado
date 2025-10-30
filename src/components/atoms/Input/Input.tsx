import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
};

export default function Input({ className = '', ...props }: Props) {
    return (
        <input
            className={`input w-full rounded-md border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 ${className}`}
            {...props}
        />
    );
}

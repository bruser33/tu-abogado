import type { ReactNode } from 'react';

type Props = {
    icon: ReactNode;
    text: string;
    className?: string;
};

export default function ValueIcon({ icon, text, className = '' }: Props) {
    return (
        <div className={`value-icon flex items-center gap-3 ${className}`}>
            <div className="value-icon-icon text-xl">{icon}</div>
            <span className="value-icon-text text-slate-700">{text}</span>
        </div>
    );
}

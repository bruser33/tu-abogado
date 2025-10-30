import type { ReactNode } from 'react';

type Props = {
    title: string;
    description: string;
    icon?: ReactNode;
    className?: string;
};

export default function ServiceCard({ title, description, icon, className = '' }: Props) {
    return (
        <div className={`service-card rounded-xl bg-white p-5 shadow ring-1 ring-slate-200 ${className}`}>
            {icon && <div className="service-icon mb-3 text-2xl">{icon}</div>}
            <h3 className="service-title text-lg font-bold text-slate-900">{title}</h3>
            <p className="service-description mt-1 text-slate-600">{description}</p>
        </div>
    );
}

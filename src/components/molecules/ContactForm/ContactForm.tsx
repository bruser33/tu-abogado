import type { FormEvent } from 'react';
import Button from '@atoms/Button';
import Input from '@atoms/Input';

export default function ContactForm() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: enviar datos (fetch/EmailJS/backend)
    };

    return (
        <form className="contact-form grid gap-3" onSubmit={handleSubmit}>
            <Input placeholder="Nombre" required />
            <Input placeholder="Teléfono" required inputMode="tel" />
            <Input placeholder="Mensaje" required />
            <Button type="submit" className="mt-2">Enviar</Button>
        </form>
    );
}

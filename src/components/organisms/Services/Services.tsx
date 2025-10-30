// src/components/organisms/Services/Services.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import BalanceIcon from '@mui/icons-material/Balance';
import SectionTitle from '@atoms/SectionTitle';
import LawServices from '@molecules/LawServices';

const SERVICES = [
    { icon: <DirectionsCarFilledIcon />, title: 'Tránsito y comparendos', desc: 'Defensas, apelaciones, y asesoría integral en infracciones de tránsito.' },
    { icon: <GavelIcon />,              title: 'Representación judicial',  desc: 'Demandas, contestaciones, audiencias y medidas cautelares.' },
    { icon: <LocalPoliceIcon />,        title: 'Accidentes de tránsito',    desc: 'Responsabilidad civil, seguros, indemnizaciones y acuerdos.' },
    { icon: <BalanceIcon />,            title: 'Contratos & asesoría',      desc: 'Redacción y revisión de contratos. Orientación legal preventiva.' },
];

export default function Services() {
    // ======== Config común slider (solo se usa en sm+) ========
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState(0);
    const GAP = 16;
    const total = useMemo(() => SERVICES.length, []);

    const getItemStep = () => {
        const track = trackRef.current;
        if (!track || track.children.length === 0) return 1;
        const first = track.children[0] as HTMLElement;
        return first.offsetWidth + GAP;
    };

    // programático vs drag
    const isProgrammatic = useRef(false);
    const programmaticTimer = useRef<number | null>(null);
    const clearProgrammaticTimer = () => {
        if (programmaticTimer.current) {
            window.clearTimeout(programmaticTimer.current);
            programmaticTimer.current = null;
        }
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const onScroll = () => {
            const step = getItemStep();
            const idx = Math.round(el.scrollLeft / step);
            setActive(Math.max(0, Math.min(total - 1, idx)));
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, [total]);

    const momentumRAF = useRef<number | null>(null);
    const stopMomentum = () => {
        if (momentumRAF.current != null) {
            cancelAnimationFrame(momentumRAF.current);
            momentumRAF.current = null;
        }
    };

    const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
        const el = trackRef.current;
        if (!el) return;
        const clamped = Math.max(0, Math.min(total - 1, index));
        const step = getItemStep();
        const from = el.scrollLeft;
        const to = clamped * step;
        const distance = Math.abs(to - from);

        stopMomentum();
        isProgrammatic.current = true;
        clearProgrammaticTimer();
        el.scrollTo({ left: to, behavior });

        const duration = Math.min(650, Math.max(280, distance * 0.6));
        programmaticTimer.current = window.setTimeout(() => {
            isProgrammatic.current = false;
            programmaticTimer.current = null;
        }, duration);
    };

    // drag + inercia (sm+)
    const dragging = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);
    const lastX = useRef(0);
    const lastT = useRef(0);
    const velocity = useRef(0);

    const snapToNearest = () => {
        const el = trackRef.current;
        if (!el) return;
        const step = getItemStep();
        const idx = Math.round(el.scrollLeft / step);
        scrollToIndex(idx, 'smooth');
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isProgrammatic.current) return;
        const el = trackRef.current;
        if (!el) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        el.setPointerCapture(e.pointerId);
        dragging.current = true;
        stopMomentum();
        clearProgrammaticTimer();

        startX.current = e.clientX;
        startScrollLeft.current = el.scrollLeft;
        lastX.current = e.clientX;
        lastT.current = performance.now();
        velocity.current = 0;
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current || isProgrammatic.current) return;
        const el = trackRef.current;
        if (!el) return;
        e.preventDefault();

        const dx = e.clientX - startX.current;
        el.scrollLeft = startScrollLeft.current - dx;

        const now = performance.now();
        const dt = now - lastT.current;
        if (dt > 0) {
            const vx = (e.clientX - lastX.current) / dt;
            velocity.current = velocity.current * 0.8 + vx * 0.2;
            lastX.current = e.clientX;
            lastT.current = now;
        }
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = trackRef.current;
        if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        if (!dragging.current) return;
        dragging.current = false;
        if (isProgrammatic.current) return;

        let v = velocity.current * 16;
        const friction = 0.92;
        const minV = 0.4;

        const step = () => {
            if (!trackRef.current) return;
            v *= friction;
            trackRef.current.scrollLeft -= v;
            if (Math.abs(v) > minV) {
                momentumRAF.current = requestAnimationFrame(step);
            } else {
                momentumRAF.current = null;
                snapToNearest();
            }
        };

        if (Math.abs(v) > 1) momentumRAF.current = requestAnimationFrame(step);
        else snapToNearest();
    };

    const onPointerCancel = () => {
        if (dragging.current) {
            dragging.current = false;
            stopMomentum();
            if (!isProgrammatic.current) snapToNearest();
        }
    };

    return (
        <Box sx={{ bgcolor: '#173760', py: { xs: 4, md: 6 } }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
                <SectionTitle id="servicios">Servicios</SectionTitle>

                {/* === Variante móvil: apilado vertical (visible solo en xs) === */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {SERVICES.map((s) => (
                            <Box key={s.title}>
                                <LawServices icon={s.icon} title={s.title} desc={s.desc} />
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {/* === Variante desktop/tablet: slider (visible en sm+) === */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Box
                        ref={trackRef}
                        tabIndex={0}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerCancel}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            overflowX: 'auto',
                            scrollSnapType: 'x mandatory',
                            pb: 1,
                            pt: 1,
                            WebkitOverflowScrolling: 'touch',
                            touchAction: 'pan-y',
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' },
                            userSelect: 'none',
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': { display: 'none' },
                        }}
                    >
                        {SERVICES.map((s, i) => (
                            <Box
                                key={s.title}
                                onClick={() => scrollToIndex(i)}
                                sx={{
                                    flex: '0 0 calc((100% - 2*16px) / 3)', // 3 visibles en sm+
                                    scrollSnapAlign: 'start',
                                }}
                            >
                                <LawServices icon={s.icon} title={s.title} desc={s.desc} />
                            </Box>
                        ))}
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }} justifyContent="center">
                        {Array.from({ length: total }).map((_, i) => (
                            <Box
                                key={i}
                                onClick={() => scrollToIndex(i)}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    transition: 'transform .15s ease',
                                    bgcolor: i === active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                                    transform: i === active ? 'scale(1.2)' : 'none',
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

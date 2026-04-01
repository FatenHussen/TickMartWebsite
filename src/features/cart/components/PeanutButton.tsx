import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type PeanutButtonProps = {
    children: ReactNode;
    className?: string;
};

function buildPeanutPath(width: number, height: number) {
    const centerY = height / 2;
    const leftBulbCenterX = width * 0.25;
    const rightBulbCenterX = width * 0.75;
    const bulbRadius = height * 0.4;
    const constrictionFactor = 0.35;
    const step = 0.75;
    const points: string[] = [`M 0 ${centerY}`];

    for (let x = 0; x <= leftBulbCenterX; x += step) {
        const dx = (x - leftBulbCenterX) / leftBulbCenterX;
        const radius = bulbRadius * (1 - dx * dx * 0.3);
        const y = centerY - Math.sqrt(
            Math.max(0, radius * radius - (x - leftBulbCenterX) * (x - leftBulbCenterX)),
        );
        points.push(`L ${x} ${Math.max(0, y)}`);
    }

    for (let x = leftBulbCenterX; x <= rightBulbCenterX; x += step) {
        const progress = (x - leftBulbCenterX) / (rightBulbCenterX - leftBulbCenterX);
        const constriction = constrictionFactor * (1 - Math.cos(progress * Math.PI * 2)) / 2;
        const radius = bulbRadius * (1 - constriction);
        const y = centerY - radius;
        points.push(`L ${x} ${Math.max(0, y)}`);
    }

    for (let x = rightBulbCenterX; x <= width; x += step) {
        const dx = (x - rightBulbCenterX) / (width - rightBulbCenterX);
        const radius = bulbRadius * (1 - dx * dx * 0.3);
        const y = centerY - Math.sqrt(
            Math.max(0, radius * radius - (x - rightBulbCenterX) * (x - rightBulbCenterX)),
        );
        points.push(`L ${x} ${Math.max(0, y)}`);
    }

    for (let x = width; x >= rightBulbCenterX; x -= step) {
        const dx = (x - rightBulbCenterX) / (width - rightBulbCenterX);
        const radius = bulbRadius * (1 - dx * dx * 0.3);
        const y = centerY + Math.sqrt(
            Math.max(0, radius * radius - (x - rightBulbCenterX) * (x - rightBulbCenterX)),
        );
        points.push(`L ${x} ${Math.min(height, y)}`);
    }

    for (let x = rightBulbCenterX; x >= leftBulbCenterX; x -= step) {
        const progress = (x - leftBulbCenterX) / (rightBulbCenterX - leftBulbCenterX);
        const constriction = constrictionFactor * (1 - Math.cos(progress * Math.PI * 2)) / 2;
        const radius = bulbRadius * (1 - constriction);
        const y = centerY + radius;
        points.push(`L ${x} ${Math.min(height, y)}`);
    }

    for (let x = leftBulbCenterX; x >= 0; x -= step) {
        const dx = (x - leftBulbCenterX) / leftBulbCenterX;
        const radius = bulbRadius * (1 - dx * dx * 0.3);
        const y = centerY + Math.sqrt(
            Math.max(0, radius * radius - (x - leftBulbCenterX) * (x - leftBulbCenterX)),
        );
        points.push(`L ${x} ${Math.min(height, y)}`);
    }

    points.push("Z");
    return points.join(" ");
}

export default function PeanutButton({
    children,
    className,
}: PeanutButtonProps) {
    const width = 220;
    const height = 96;
    const path = buildPeanutPath(width, height);

    return (
        <button
            type="button"
            className={cn(
                "group relative inline-flex min-h-[68px] w-full max-w-[220px] items-center justify-center px-3 py-2.5 text-center transition-transform duration-300 hover:scale-[1.015]",
                className,
            )}
        >
            <svg
                aria-hidden="true"
                viewBox={`0 0 ${width} ${height}`}
                className="absolute inset-0 h-full w-full overflow-visible"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id="peanut-outer-glow" x="-12%" y="-20%" width="124%" height="140%">
                        <feGaussianBlur stdDeviation="7" />
                    </filter>
                    <filter id="peanut-inner-glow" x="-8%" y="-14%" width="116%" height="128%">
                        <feGaussianBlur stdDeviation="3.5" />
                    </filter>
                </defs>
                <path
                    d={path}
                    fill="#FFD000"
                    fillOpacity="0.22"
                    filter="url(#peanut-outer-glow)"
                    className="transition-opacity duration-300 group-hover:[fill-opacity:0.3]"
                />
                <path
                    d={path}
                    fill="#FFD000"
                    fillOpacity="0.42"
                    filter="url(#peanut-inner-glow)"
                    className="transition-opacity duration-300 group-hover:[fill-opacity:0.52]"
                />
                <path d={path} fill="#FFD000" />
            </svg>
            <span className="relative z-10 whitespace-nowrap px-4 text-[clamp(0.9rem,1.4vw,1.3rem)] font-black leading-none tracking-[-0.02em] text-black">
                {children}
            </span>
        </button>
    );
}

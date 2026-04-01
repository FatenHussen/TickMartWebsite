import React from"react";
import Button from"@/shared/ui/Button";
import { cn } from"@/shared/lib/utils";

type AnimatedButtonNote = {
 primary: React.ReactNode; // النص الأول
 secondary: React.ReactNode; // النص الثاني
};

type AnimatedButtonProps = React.ComponentProps<typeof Button> & {
 note: AnimatedButtonNote;
 heightClassName?: string; // default h-9
 durationMs?: number; // default 2500
 pauseRatio?: number; // default 0.4 (قديش يثبت قبل ما يتحرك)
};

export default function AnimatedButton({
 note,
 className,
 heightClassName ="h-9",
 durationMs = 2500,
 pauseRatio = 0.4,
 ...props
}: AnimatedButtonProps) {
 const style = {
 ["--ab-duration"as any]: `${durationMs}ms`,
 ["--ab-pause"as any]: `${pauseRatio}`,
 } as React.CSSProperties;

 return (
 <Button
 {...props}
 style={{ ...(props.style || {}), ...style }}
 className={cn(
"relative inline-flex overflow-hidden rounded-full items-center justify-center",
 heightClassName,
 className
 )}
 >
 <span className="invisible grid pointer-events-none">
 <span className={cn("col-start-1 row-start-1 whitespace-nowrap px-1", heightClassName)}>
 {note.primary}
 </span>
 <span className={cn("col-start-1 row-start-1 whitespace-nowrap px-1", heightClassName)}>
 {note.secondary}
 </span>
 </span>
 <span className="ab-track">
 <span className={cn("ab-row", heightClassName)}>{note.primary}</span>
 <span className={cn("ab-row", heightClassName)}>{note.secondary}</span>
 </span>
 </Button>
 );
}

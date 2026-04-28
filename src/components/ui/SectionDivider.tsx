interface SectionDividerProps {
    color?: string;
    type?: 'wave' | 'diagonal' | 'layered' | 'soft';
    position?: 'top' | 'bottom';
    flip?: boolean;
    className?: string;
}

export function SectionDivider({
    color = '#F8FAFC',
    type = 'layered',
    position = 'bottom',
    flip = false,
    className = ""
}: SectionDividerProps) {
    // Elegant, smooth curve for 'soft' type
    const softPath = "M0,64 C300,32 900,96 1200,64 V128 H0 Z";
    
    // Modern layered waves
    const layeredPaths = [
        "M0,64 C240,100 480,20 720,64 C960,108 1200,40 1200,40 V128 H0 Z",
        "M0,80 C300,40 600,120 900,80 C1100,53 1200,100 1200,100 V128 H0 Z",
        "M0,100 C400,60 800,140 1200,100 V128 H0 Z"
    ];

    const diagonalPath = "M1200 128L0 128 1200 0z";

    // Auto-calculate flip based on position if not explicitly provided
    // If at top, we usually want the 'fill' at the top, so we rotate 180deg.
    const shouldRotate = position === 'top' ? !flip : flip;

    return (
        <div className={`
            absolute left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none
            ${position === 'top' ? 'top-0' : 'bottom-0'}
            ${shouldRotate ? 'rotate-180' : ''}
            ${className}
        `}>
            <svg
                viewBox="0 0 1200 128"
                preserveAspectRatio="none"
                className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[110px]"
            >
                {type === 'layered' && (
                    <>
                        <path d={layeredPaths[0]} fill={color} opacity="0.1" />
                        <path d={layeredPaths[1]} fill={color} opacity="0.3" />
                        <path d={layeredPaths[2]} fill={color} />
                    </>
                )}
                
                {type === 'soft' && (
                    <path d={softPath} fill={color} />
                )}

                {type === 'diagonal' && (
                    <path d={diagonalPath} fill={color} />
                )}

                {type === 'wave' && (
                     <path d="M0,64 C320,128 880,0 1200,64 V128 H0 Z" fill={color} />
                )}
            </svg>
        </div>
    );
}

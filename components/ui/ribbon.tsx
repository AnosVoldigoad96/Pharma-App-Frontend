import React from "react";

interface RibbonProps {
    text: string;
    className?: string;
}

export function Ribbon({ text, className = "" }: RibbonProps) {
    return (
        <div className={`ribbon ${className}`}>
            {text}
        </div>
    );
}

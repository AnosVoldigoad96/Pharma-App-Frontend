"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const PDFReader = dynamic(() => import('./PDFReader'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-screen text-white">Loading Viewer...</div>,
});

interface PDFViewerWrapperProps {
    fileUrl: string;
}

export default function PDFViewerWrapper({ fileUrl }: PDFViewerWrapperProps) {
    return <PDFReader fileUrl={fileUrl} />;
}

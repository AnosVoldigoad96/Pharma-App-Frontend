// components/PDFReader.tsx
"use client";

import * as React from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import type { ToolbarProps } from '@react-pdf-viewer/default-layout';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { PanelLeft } from 'lucide-react';

// Import Styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

// Use local worker to avoid cross-origin issues
const WORKER_URL = `/pdf.worker.min.js`;

interface PDFReaderProps {
    fileUrl: string;
}

const PDFReader: React.FC<PDFReaderProps> = ({ fileUrl }) => {
    const defaultLayoutPluginInstanceRef = React.useRef<any>(null);

    // 1. Create a dedicated toolbar plugin for Desktop
    // This ensures we have access to all slots including MoreActionsPopover
    const desktopToolbarPluginInstance = toolbarPlugin();
    const { Toolbar: DesktopToolbar } = desktopToolbarPluginInstance;

    // 2. Default Layout Plugin (Desktop)
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar: () => (
            <div className="hidden md:block">
                <DesktopToolbar>
                    {(slots: any) => {
                        const {
                            CurrentPageInput,
                            Download,
                            EnterFullScreen,
                            GoToNextPage,
                            GoToPreviousPage,
                            NumberOfPages,
                            Print,
                            ShowSearchPopover,
                            Zoom,
                            ZoomIn,
                            ZoomOut,
                            MoreActionsPopover,
                            UserOptions,
                        } = slots;

                        console.log('DesktopToolbar slots:', Object.keys(slots));

                        return (
                            <div className="flex items-center justify-start gap-6 w-full">
                                <div className="flex items-center gap-2">
                                    {/* Custom Sidebar Toggle */}
                                    <button
                                        onClick={() => defaultLayoutPluginInstanceRef.current?.toggleSidebar()}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-200"
                                        title="Toggle Sidebar"
                                    >
                                        <PanelLeft className="w-5 h-5" />
                                    </button>

                                    <ShowSearchPopover />
                                    <div className="h-4 w-px bg-white/10 mx-1" />
                                    <ZoomOut />
                                    <Zoom />
                                    <ZoomIn />
                                </div>
                                <div className="flex items-center gap-2">
                                    <GoToPreviousPage />
                                    <div className="flex items-center gap-1 text-slate-200">
                                        <CurrentPageInput />
                                        <span className="mx-1">/</span>
                                        <NumberOfPages />
                                    </div>
                                    <GoToNextPage />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Download />
                                    <Print />
                                    {MoreActionsPopover && <MoreActionsPopover />}
                                    {UserOptions && <UserOptions />}
                                    <EnterFullScreen />
                                </div>
                            </div>
                        );
                    }}
                </DesktopToolbar>
            </div>
        ),
    });

    // Store instance in ref to access toggleSidebar inside renderToolbar
    defaultLayoutPluginInstanceRef.current = defaultLayoutPluginInstance;

    // 3. Mobile Toolbar (via separate Toolbar Plugin)
    const mobileToolbarPluginInstance = toolbarPlugin();
    const { Toolbar: MobileToolbar } = mobileToolbarPluginInstance;

    return (
        <div className="h-full w-full bg-slate-950 flex flex-col relative">

            <div className="flex-1 w-full relative flex justify-center overflow-hidden">
                <div className="w-full h-full max-w-[1600px] shadow-2xl border-x border-white/5 relative">
                    <Worker workerUrl={WORKER_URL}>
                        <Viewer
                            fileUrl={fileUrl}
                            plugins={[
                                defaultLayoutPluginInstance,
                                desktopToolbarPluginInstance,
                                mobileToolbarPluginInstance
                            ]}
                            theme="dark"
                            initialPage={0}
                            defaultScale={SpecialZoomLevel.PageWidth}
                            enableSmoothScroll={true}
                        />
                    </Worker>
                </div>
            </div>

            {/* Mobile Toolbar (Beneath Viewer) */}
            <div className="md:hidden w-full mt-[5px] z-50 px-4 pb-4">
                <div className="bg-slate-800 text-slate-200 rounded-2xl border border-slate-700 shadow-xl p-2 flex justify-center">
                    <MobileToolbar />
                </div>
            </div>
        </div>
    );
};

export default PDFReader;

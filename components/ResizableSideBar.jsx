"use client";

import {useEffect, useRef, useState} from "react";

export default function ResizableSidebar({
                                             children,
                                             min = 250,
                                             max = 350,
                                             storageKey = "sl-sidebar-width",
                                             defaultWidth = 300,
                                         }) {
    const [width, setWidth] = useState(defaultWidth);
    const startX = useRef(0);
    const startW = useRef(defaultWidth);
    const dragging = useRef(false);

    // Charger la largeur sauvegardée
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) setWidth(Math.min(max, Math.max(min, parseInt(saved, 10))));
        } catch {
        }
    }, [min, max, storageKey]);

    // Handlers drag
    const onMouseDown = (e) => {
        dragging.current = true;
        startX.current = e.clientX;
        startW.current = width;
        document.body.style.userSelect = "none";
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!dragging.current) return;
        const delta = e.clientX - startX.current;
        const next = Math.min(max, Math.max(min, startW.current + delta));
        setWidth(next);
    };

    const onMouseUp = () => {
        dragging.current = false;
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        try {
            localStorage.setItem(storageKey, String(width));
        } catch {
        }
    };

    // Support tactile
    const onTouchStart = (e) => {
        dragging.current = true;
        startX.current = e.touches[0].clientX;
        startW.current = width;
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchEnd);
    };
    const onTouchMove = (e) => {
        if (!dragging.current) return;
        const delta = e.touches[0].clientX - startX.current;
        const next = Math.min(max, Math.max(min, startW.current + delta));
        setWidth(next);
    };
    const onTouchEnd = () => {
        dragging.current = false;
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        try {
            localStorage.setItem(storageKey, String(width));
        } catch {
        }
    };

    // Double-clic pour reset à la largeur par défaut
    const onDoubleClick = () => {
        setWidth(defaultWidth);
        try {
            localStorage.setItem(storageKey, String(defaultWidth));
        } catch {
        }
    };

    return (
        <aside style={{width}} className="relative bg-white border-r border-gray-200 p-6 flex flex-col shrink-0">
            {children}

            <div
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onDoubleClick={onDoubleClick}
                title="Drag to resize • Double-click to reset"
                className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize select-none bg-transparent hover:bg-gray-200 active:bg-gray-300 transition-colors`}/>
        </aside>
    );
}

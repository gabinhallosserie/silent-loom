"use client";
import {useEffect} from "react";

export default function Toast({message, type = "info", onClose}) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const colors = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    return (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg text-white shadow ${colors[type]}`}>
            {message}
        </div>
    );
}
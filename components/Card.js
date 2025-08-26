export default function Card({children, className = ""}) {
    return (
        <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm p-6 ${className}`}>
            {children}
        </div>
    );
}
export default function PageHeader({title, subtitle}) {
    return (
        <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </header>
    );
}

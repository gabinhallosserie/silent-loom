export default function SettingsPage() {
    return (
        <div className="w-9/12 mt-10 flex flex-col gap-6">
            <header>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-sm text-zinc-500">Configure Silent Loom preferences</p>
            </header>

            <section className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <i className="bi bi-gear-wide-connected text-5xl text-gray-400"></i>
                    <h2 className="text-lg font-medium text-gray-800">Under development</h2>
                    <p className="text-sm text-gray-500 max-w-sm">
                        This page is currently being built. Soon you will be able to adjust
                        your Silent Loom configuration here.
                    </p>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            <i className="bi bi-tools mr-2"></i> Work in progress
          </span>
                </div>
            </section>
        </div>
    );
}
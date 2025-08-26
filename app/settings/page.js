import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Settings" subtitle="Configure Silent Loom preferences"/>
            <Card className="text-center py-16">
                <i className="bi bi-gear-wide-connected text-5xl text-gray-400"></i>
                <h2 className="text-lg font-semibold mt-4">Under development</h2>
                <p className="text-sm text-gray-500 mt-2">
                    Settings are not editable yet.
                    The base path is defined in <code>.env.local</code>.
                </p>
            </Card>
        </div>
    );
}

import { toast } from 'sonner';

export default function ToastTest() {
    const testSuccess = () => {
        toast.success('✅ Success toast is working!', {
            description: 'This confirms the Toaster component is properly mounted.'
        });
    };

    const testError = () => {
        toast.error('❌ Error toast is working!', {
            description: 'This confirms error toasts display correctly.'
        });
    };

    const testInfo = () => {
        toast.info('ℹ️ Info toast is working!', {
            description: 'This confirms info toasts display correctly.'
        });
    };

    const testWarning = () => {
        toast.warning('⚠️ Warning toast is working!', {
            description: 'This confirms warning toasts display correctly.'
        });
    };

    return (
        <div className="p-8 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Toast Test Component</h2>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={testSuccess}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Test Success Toast
                </button>
                <button
                    onClick={testError}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Test Error Toast
                </button>
                <button
                    onClick={testInfo}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Test Info Toast
                </button>
                <button
                    onClick={testWarning}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    Test Warning Toast
                </button>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import { MotionDiv } from "@/components/ui/motion";

interface Props {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return (
                <FallbackComponent
                    error={this.state.error!}
                    resetError={this.resetError}
                />
            );
        }

        return this.props.children;
    }
}

function DefaultErrorFallback({
    error,
    resetError
}: {
    error: Error;
    resetError: () => void;
}) {
    return (
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
        >
            <div className="max-w-md w-full text-center">
                <MotionDiv
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Oops! Something went wrong
                    </h2>

                    <p className="text-gray-600 mb-6">
                        We encountered an unexpected error. Please try again.
                    </p>

                    <details className="text-left mb-6">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            Error details
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                            {error.message}
                        </pre>
                    </details>

                    <button
                        onClick={resetError}
                        className="w-full bg-primary-identity hover:bg-primary-identity/90 text-white font-medium py-3 px-4 rounded-md transition-colors"
                    >
                        Try Again
                    </button>
                </MotionDiv>
            </div>
        </MotionDiv>
    );
}

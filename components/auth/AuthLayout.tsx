interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    locale: string;
}

export default function AuthLayout({
    children,
    title,
    description,
    locale
}: AuthLayoutProps) {
    return (
        <main
            className="min-h-screen bg-gray-50"
            role="main"
            aria-label="Authentication page"
        >
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-identity text-white px-4 py-2 rounded-md z-50"
            >
                Skip to main content
            </a>

            {/* Structured data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: title,
                        description: description,
                        url: typeof window !== "undefined" ? window.location.href : "",
                        inLanguage: locale,
                        isPartOf: {
                            "@type": "WebSite",
                            name: "RiseUp",
                            url: typeof window !== "undefined" ? window.location.origin : "",
                        },
                    }),
                }}
            />

            <div id="main-content">
                {children}
            </div>
        </main>
    );
}

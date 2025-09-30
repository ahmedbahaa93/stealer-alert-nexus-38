import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-blue-600 mb-8">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
                    {item.href ? (
                        <a
                            href={item.href}
                            className="hover:text-blue-800 transition-colors"
                        >
                            {item.label}
                        </a>
                    ) : (
                        <span className={index === items.length - 1 ? "text-gray-500" : ""}>
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;

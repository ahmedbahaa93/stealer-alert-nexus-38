import React from 'react';

interface SidebarLinkBorderProps {
    children: React.ReactNode;
    isActive?: boolean;
}

function SidebarLinkBorder({ children, isActive = false }: SidebarLinkBorderProps) {
    return (
        <div className="group relative flex">
            {/* Left border with animation effect */}
            <div
                className={`
          absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-green-500
          transform origin-left transition-all duration-300 ease-out
          ${isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100'}
        `}
            />

            {/* Content container */}
            <div className="flex-1 pl-3 transition-all duration-300 group-hover:pl-4">
                {children}
            </div>
        </div>
    );
}

export default SidebarLinkBorder;

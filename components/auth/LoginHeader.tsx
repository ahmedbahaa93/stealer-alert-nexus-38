"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export const LoginHeader = () => {
    return (
        <header className="w-full px-6 lg:px-10 py-6 bg-gradient-to-br from-[#f3f8fb] to-[#e8f4f8]">
            <div className="max-w-[1368px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Image
                        src="/AuthHeaderLogo.svg"
                        alt="RaiseUp Logo"
                        width={160}
                        height={48}
                        className="h-12 w-auto"
                        priority
                    />
                </Link>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="w-[100px] h-[40px] text-[#0f43b4] border-2 border-[#0f43b4] rounded-xl font-bold text-sm hover:bg-[#0f43b4] hover:text-white transition-all duration-300 shadow-sm"
                        asChild
                    >
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button
                        className="w-[100px] h-[40px] bg-gradient-to-r from-[#0f43b4] to-[#1a5bc4] text-white rounded-xl shadow-lg hover:shadow-xl font-bold text-sm transition-all duration-300 transform hover:scale-105"
                        asChild
                    >
                        <Link href="/signup">Register</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
};

/*~~~~~~~~$ Export $~~~~~~~~*/
export default LoginHeader;

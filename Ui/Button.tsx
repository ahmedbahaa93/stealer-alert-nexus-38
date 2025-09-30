"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Iprops extends ButtonHTMLAttributes<HTMLButtonElement> {// يعني ده التايب بتاغ الحاجه الي هاتعامل معاها غير الي انا حتهم كااتربيوتbutton Html attrubute
    children: ReactNode;
    className?: string;
    isLoading?: boolean;
}
const Button = ({ children, className, isLoading, ...rest }: Iprops) => {  // rest=> يعني ايه حاجه هاتتبعت للcomponnent da
    return (
        <button className={`${className} p-2 flex items-center justify-center  `}{...rest}>
            {isLoading ? (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : null}
            {children}
        </button>
    )
}

export default Button
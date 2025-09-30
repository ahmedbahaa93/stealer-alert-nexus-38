"use client";

import BlogPage from "@/components/Blog/BlogPage"
import NamePageSetter from "@/components/NamePageSetter"
import { Suspense } from "react";

function Page() {
    return (
        <div className="common-bg">
            <Suspense fallback={<div>Loading...</div>}>
                <BlogPage />
                <NamePageSetter pageKey="blog" />
            </Suspense>
        </div>
    )
}

export default Page

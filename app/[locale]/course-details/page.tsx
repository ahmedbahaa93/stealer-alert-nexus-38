import CourseDtailsPage from "@/components/CourseDtailsPage/CourseDtailsPage"
import NamePageSetter from "@/components/NamePageSetter"
import { SowBreadCrumbsProvider } from "@/context/SowBreadCrumbs"

function Page() {
    return (
        <SowBreadCrumbsProvider>
            <div className="common-bg">
                <CourseDtailsPage />
                <NamePageSetter pageKey="course-details" />
            </div>
        </SowBreadCrumbsProvider>
    )
}

export default Page

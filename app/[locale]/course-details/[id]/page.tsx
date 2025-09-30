import CourseDtailsPage from "@/components/CourseDtailsPage/CourseDtailsPage"
import NamePageSetter from "@/components/NamePageSetter"
import { SowBreadCrumbsProvider } from "@/context/SowBreadCrumbs"
import { Metadata } from "next"

interface CourseDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
    const { id } = await params
    return {
        title: `Course Details | ${id}`,
        description: "Learn more about this course and enroll today",
    }
}

async function CourseDetailPage({ params }: CourseDetailPageProps) {
    const { id } = await params
    return (
        <SowBreadCrumbsProvider>
            <div className="page-container course-details-container">
                <CourseDtailsPage courseId={id} />
                <NamePageSetter pageKey="course-details" />
            </div>
        </SowBreadCrumbsProvider>
    )
}

export default CourseDetailPage

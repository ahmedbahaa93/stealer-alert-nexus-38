import { redirect } from 'next/navigation'

function Page() {
    // Redirect to courses page since payment requires a courseId
    redirect('/courses')
}

export default Page

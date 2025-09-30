import NamePageSetter from "@/components/NamePageSetter"
import MyCourses from "@/components/user/my-courses/MyCourses"

function Page() {
  return (
    <>
      <MyCourses />
      <NamePageSetter pageKey="my-course" />
    </>
  )
}

export default Page

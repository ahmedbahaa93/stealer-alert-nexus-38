import NamePageSetter from "@/components/NamePageSetter"
import Certificates from "@/components/user/certificates/Certificates"

function Page() {
  return (
    <>
      <Certificates />
      <NamePageSetter pageKey="certificates" />
    </>
  )
}

export default Page

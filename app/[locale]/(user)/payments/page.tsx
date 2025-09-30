import NamePageSetter from "@/components/NamePageSetter"
import Payments from "@/components/user/payments/Payments"

function Page() {
  return (
    <>
      <Payments />
      <NamePageSetter pageKey="pay" />
    </>
  )
}

export default Page

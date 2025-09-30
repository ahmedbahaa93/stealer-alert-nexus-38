import PaymentForm from "@/components/Payment/PaymentForm"

interface PaymentPageProps {
    courseId: string;
}

const PaymentPage = ({ courseId }: PaymentPageProps) => {
    return (
        <div className="min-h-screen">
            <PaymentForm courseId={courseId} />
        </div>
    )
}

export default PaymentPage

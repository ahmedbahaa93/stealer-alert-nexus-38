import Categories from "@/components/Categories/Categories"
import NamePageSetter from "@/components/NamePageSetter"

function Page() {
    return (
        <div className="common-bg">
            <Categories />
            <NamePageSetter pageKey="categories" />
        </div>
    )
}

export default Page

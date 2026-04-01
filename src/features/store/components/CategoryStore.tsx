import CategoryTopNav, {
    type CategoryNavItem,
} from "@/shared/component/CategoryTopNav";

type CategoryStoreProps = {
    categories: CategoryNavItem[];
    onSelectCategory: (categoryId: number) => void;
};

function CategoryStore({
    categories,
    onSelectCategory,
}: CategoryStoreProps) {
    if (categories.length === 0) return null;

    return (
        <div className="mt-6 bg-blue-off rounded-3xl p-6 flex justify-start">
            <CategoryTopNav
                categories={categories}
                onCategoryClick={onSelectCategory}
            />
        </div>
    );
}

export default CategoryStore;

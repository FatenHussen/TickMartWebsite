import { HiViewGrid } from"react-icons/hi";
import type { Category } from"../types";

type CategoryTopNavProps = {
 categories: Category[];
 selectedCategoryId: number;
 onCategorySelect: (category: Category) => void;
};

export default function CategoryTopNav({
 categories,
 selectedCategoryId,
 onCategorySelect,
}: CategoryTopNavProps) {

 // Map to grocery subcategories for top nav (matching image)
 const topNavCategories = [
 { id: 1, name:"Fruits"},
 { id: 2, name:"Vegetables"},
 { id: 3, name:"Meat"},
 { id: 4, name:"Dairy"},
 { id: 5, name:"Snacks"},
 { id: 6, name:"Drinks"},
 ];

 return (
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-2 flex-wrap">
 {topNavCategories.map((category) => (
 <button
 key={category.id}
 onClick={() => {
 // Find matching category from main categories or use default
 const mainCategory = categories.find((c) => c.id === category.id) || categories[0];
 onCategorySelect(mainCategory);
 }}
 className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
 selectedCategoryId === category.id
 ?"bg-primary-light text-white"
 :"bg-custom-primary text-custom-secondary hover:bg-custom-hover"
 }`}
 >
 {category.name}
 </button>
 ))}
 </div>
 <button className="p-2 rounded-lg hover:bg-custom-hover text-custom-secondary">
 <HiViewGrid className="w-5 h-5"/>
 </button>
 </div>
 );
}

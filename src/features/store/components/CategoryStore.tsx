import CategoryTopNav from"@/shared/component/CategoryTopNav";

function CategoryStore() {
 const topNavCategories: any[] = [
 { id: 1, name:"testing", selected: true },
 { id: 2, name:"testing", selected: false },
 { id: 3, name:"testing", selected: false },
 { id: 4, name:"testing", selected: false },
 { id: 5, name:"testing", selected: false },
 { id: 6, name:"testing", selected: false },
 ];

 return (
 <div className="mt-6 bg-blue-off rounded-3xl p-6 flex justify-start">
 <CategoryTopNav categories={topNavCategories} />
 </div>
 );
}

export default CategoryStore;

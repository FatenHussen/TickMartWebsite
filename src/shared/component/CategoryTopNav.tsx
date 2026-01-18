export type CategoryNavItem = {
  id: number;
  name: string;
  selected?: boolean;
};

type CategoryTopNavProps = {
  categories: CategoryNavItem[];
  onFilterClick?: () => void;
};

export default function CategoryTopNav({
  categories,
}: CategoryTopNavProps) {
  return (
    <div className="flex items-center rtl:flex-row-reverse">
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              category.selected
                ? "bg-primary-light text-white"
                : "bg-white text-primary-light border border-primary-light"
            }`}
          >
            {category.name}
          </div>
        ))}
      </div>
      {/* <Button
        variant="ghost"
        size="sm"
        onClick={onFilterClick}
        className="w-10 h-10! rounded-full! bg-white! border! border-gray-300! hover:bg-gray-50! p-0!"
        aria-label="Filter"
        title="Filter"
      >
        <HiFilter className="w-5 h-5 text-gray-700" />
      </Button> */}
    </div>
  );
}

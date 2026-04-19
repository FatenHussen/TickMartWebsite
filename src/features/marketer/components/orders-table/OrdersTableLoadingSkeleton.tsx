const SKELETON_ROW_COUNT = 5;
const SKELETON_COLUMN_COUNT = 7;

export function OrdersTableLoadingSkeleton() {
    return (
        <>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                    {Array.from({ length: SKELETON_COLUMN_COUNT }).map((__, colIndex) => (
                        <td key={colIndex} className="px-4 py-4">
                            <div className="h-4 rounded-md bg-custom-tertiary/80" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

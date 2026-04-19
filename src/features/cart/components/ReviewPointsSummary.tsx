type ReviewPointsSummaryProps = {
 pointsBefore: number;
 pointsUsed: number;
 pointsEarned: number;
 pointsNewBalance: number;
 pointsSavings: string;
};

export default function ReviewPointsSummary({
 pointsBefore,
 pointsUsed,
 pointsEarned,
 pointsNewBalance,
 pointsSavings,
}: ReviewPointsSummaryProps) {
 return (
 <div
 className="rounded-2xl p-4 mt-4 w-full border border-custom-secondary bg-custom-secondary dark:bg-custom-tertiary shadow-sm"
 >
 <div className="grid grid-cols-2 gap-4 text-center mb-3">
 <PointsItem label="Points before"value={pointsBefore.toLocaleString()} />
 <PointsItem
 label="Points used"
 value={`-${pointsUsed}`}
 color="#EF4444"
 />
 <PointsItem
 label="Points earned"
 value={`+${pointsEarned}`}
 color="#22C55E"
 />
 <PointsItem
 label="New balance"
 value={pointsNewBalance.toLocaleString()}
 color="#2C8090"
 />
 </div>

 {/* Savings message */}
 <div
 className="text-center py-2 px-3 rounded-lg text-sm bg-status-success"
 >
 <span className="text-status-success">
 You saved {pointsSavings} by using your points 🎉
 </span>
 </div>
 </div>
 );
}

type PointsItemProps = {
 label: string;
 value: string;
 color?: string;
};

function PointsItem({ label, value, color }: PointsItemProps) {
 return (
 <div>
 <p className="text-xs text-custom-secondary mb-1">{label}</p>
 <p
 className="text-lg font-bold"
 style={color ? { color } : undefined}
 >
 {value}
 </p>
 </div>
 );
}

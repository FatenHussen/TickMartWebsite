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
      className="rounded-2xl p-4 mt-4 w-full"
      style={{
        background: "linear-gradient(180deg, #E4F0FB 100%, #E5F3FF 100%)",
        borderImage: "linear-gradient(180deg, #4CDAF6, #2C8090) 1",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="grid grid-cols-2 gap-4 text-center mb-3">
        <PointsItem label="Points before" value={pointsBefore.toLocaleString()} />
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
        />
      </div>

      {/* Savings message */}
      <div
        className="text-center py-2 px-3 rounded-lg text-sm"
        style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
      >
        <span style={{ color: "#22C55E" }}>
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

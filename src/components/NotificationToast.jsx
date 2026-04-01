function NotificationToast({ notification, onClick, onClose }) {
  if (!notification) return null;

  const isAdmin = notification.type === "admin";
  const isPinned = String(notification.is_fixed) === "1";
  const showImage =
    notification.media_type === "image" && Boolean(notification.media_url);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] w-[min(92vw,24rem)]">
      <div
        className={`pointer-events-auto overflow-hidden rounded-2xl border bg-white shadow-2xl transition-all ${
          isAdmin
            ? "border-amber-300 ring-1 ring-amber-200"
            : "border-slate-200 ring-1 ring-slate-100"
        }`}
      >
        <button
          type="button"
          onClick={onClick}
          className="block w-full text-left"
        >
          {showImage ? (
            <img
              src={notification.media_url}
              alt={notification.title || "Notification image"}
              className="h-44 w-full object-cover"
            />
          ) : null}

          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {isAdmin ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                      Admin
                    </span>
                  ) : null}
                  {isPinned ? (
                    <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
                      Pinned
                    </span>
                  ) : null}
                  {notification.emoji ? (
                    <span className="text-lg leading-none">{notification.emoji}</span>
                  ) : null}
                </div>

                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                  {notification.title}
                </h3>
                <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                  {notification.body}
                </p>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onClose();
                }}
                className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close notification"
              >
                x
              </button>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default NotificationToast;

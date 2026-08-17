import { useToastStore } from '../../store/toastStore';

// Toast stack - renders messages pushed via the toast store (save confirmations,
// compile errors, alert notifications). Click a toast to dismiss it.
export default function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="toasts">
      {toasts.map((t) => (
        <button
          key={t.id}
          className={`toast toast--${t.kind}`}
          onClick={() => dismiss(t.id)}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}

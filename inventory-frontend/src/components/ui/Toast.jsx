import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return createPortal(
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 rounded-md border px-4 py-3 text-sm shadow-lg animate-in fade-in slide-in-from-top-2
            ${t.type === "success" ? "border-success/30 bg-success-bg text-success" : "border-danger/30 bg-danger-bg text-danger"}`}
        >
          {t.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <span className="font-medium">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="ml-2 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
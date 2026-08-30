import { createContext, useContext, useState, useCallback } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, message: "", resolve: null });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({ isOpen: true, message, resolve });
    });
  }, []);

  const handleAnswer = (result) => {
    state.resolve?.(result);
    setState({ isOpen: false, message: "", resolve: null });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.isOpen && (
        <ConfirmDialog
          message={state.message}
          onConfirm={() => handleAnswer(true)}
          onCancel={() => handleAnswer(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-text-primary">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-danger-bg px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
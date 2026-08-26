export function Switch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full shadow-inner
        transition-colors duration-300 ease-in-out
        hover:brightness-110 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100
        ${checked ? "bg-success" : "bg-danger"}
      `}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md
          transition-transform duration-300 ease-in-out
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
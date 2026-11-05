export function Loader({ label = 'Curating residences...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[320px] flex-col items-center justify-center gap-4 py-16"
    >
      <div className="relative flex h-12 w-12 items-center justify-center border border-[#B69A69]/40">
        <div className="h-6 w-6 animate-spin border border-[#B69A69] border-t-transparent" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#41413D]/75">
        {label}
      </p>
    </div>
  );
}


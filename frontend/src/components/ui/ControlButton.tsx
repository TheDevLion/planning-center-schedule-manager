import type { ReactNode } from "react";

type ControlButtonProps = {
  id: string;
  dataTestId: string;
  ariaLabel: string;
  title?: string;
  onClick: () => void;
  disabled?: boolean;
  icon: ReactNode;
  label?: string;
  variant?: "square" | "full";
};

const BASE_CLASS =
  "inline-flex items-center justify-center rounded-[10px] border border-slate-300 bg-slate-50 text-slate-900 transition hover:border-slate-400 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50";

export const ControlButton = ({
  id,
  dataTestId,
  ariaLabel,
  title,
  onClick,
  disabled = false,
  icon,
  label,
  variant = "full",
}: ControlButtonProps): JSX.Element => {
  const sizeClass = variant === "square" ? "h-9 w-9" : "min-h-10 w-full";
  const contentClass = label ? "gap-1 px-2 text-sm font-semibold" : "";

  return (
    <button
      id={id}
      data-testid={dataTestId}
      type="button"
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE_CLASS} ${sizeClass} ${contentClass}`.trim()}
    >
      {icon}
      {label ? <span>{label}</span> : null}
    </button>
  );
};

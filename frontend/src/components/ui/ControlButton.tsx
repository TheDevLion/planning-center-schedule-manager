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
  "inline-flex items-center justify-center rounded-[10px] border border-btn-border bg-btn-bg text-brand font-medium shadow-sm transition hover:border-btn-hover-border hover:bg-btn-hover-bg active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50";

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
  const sizeClass = variant === "square" ? "h-9 w-9 md:h-10 md:w-10" : "min-h-10 w-full md:min-h-11";
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
      {label ? <span className="hidden md:inline">{label}</span> : null}
    </button>
  );
};

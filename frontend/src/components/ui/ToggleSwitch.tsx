type ToggleSwitchProps = {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  ariaLabel: string;
};

export const ToggleSwitch = ({
  id,
  checked,
  onChange,
  ariaLabel,
}: ToggleSwitchProps): JSX.Element => {
  return (
    <button
      id={id}
      data-testid={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-brand" : "bg-border-strong"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
};

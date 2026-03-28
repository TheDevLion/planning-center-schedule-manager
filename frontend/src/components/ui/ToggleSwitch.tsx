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
      className={`relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-indigo-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[20px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
};

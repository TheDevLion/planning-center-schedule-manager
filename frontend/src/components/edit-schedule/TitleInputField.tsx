import { useTranslation } from "../../i18n/i18nStore";
import type { MoveDirection } from "../../types/schedule";

type TitleInputFieldProps = {
  activityId: string;
  index: number;
  value: string;
  moveHint?: MoveDirection;
  onChange: (value: string) => void;
};

export const TitleInputField = ({
  activityId,
  index,
  value,
  moveHint,
  onChange,
}: TitleInputFieldProps): JSX.Element => {
  const t = useTranslation();

  return (
    <div className="relative min-w-0 flex-1">
      <input
        id={`title-input-${activityId}`}
        data-testid={`title-input-${index}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t.edit.activityName}
        className="min-h-10 w-full rounded-lg border border-border-strong px-2.5 py-2 pr-[74px] text-sm text-txt outline-none ring-0 transition focus:border-brand"
      />
      {moveHint && (
        <span
          className={`pointer-events-none absolute right-2 top-1 inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${
            moveHint === "up" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          } animate-move-hint`}
        >
          {moveHint}
        </span>
      )}
    </div>
  );
};

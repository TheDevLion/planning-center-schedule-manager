import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import { useTranslation } from "../../i18n/i18nStore";

const ACTION_BUTTON_CLASS =
  "inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-btn-border bg-btn-bg text-brand shadow-sm transition hover:border-btn-hover-border hover:bg-btn-hover-bg active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50";

type RowActionButtonsProps = {
  activityId: string;
  index: number;
  total: number;
  onMove: (index: number, direction: number) => void;
  onRemove: (id: string) => void;
};

export const RowActionButtons = ({
  activityId,
  index,
  total,
  onMove,
  onRemove,
}: RowActionButtonsProps): JSX.Element => {
  const t = useTranslation();

  return (
    <div className="inline-flex items-center gap-1">
      <button
        id={`move-up-button-${activityId}`}
        data-testid={`move-up-button-${index}`}
        type="button"
        aria-label={t.edit.moveUp}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onMove(index, -1)}
        disabled={index === 0}
        className={ACTION_BUTTON_CLASS}
      >
        <ArrowUp size={14} />
      </button>
      <button
        id={`move-down-button-${activityId}`}
        data-testid={`move-down-button-${index}`}
        type="button"
        aria-label={t.edit.moveDown}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onMove(index, 1)}
        disabled={index === total - 1}
        className={ACTION_BUTTON_CLASS}
      >
        <ArrowDown size={14} />
      </button>
      <button
        id={`remove-button-${activityId}`}
        data-testid={`remove-button-${index}`}
        aria-label={t.edit.remove}
        onClick={() => onRemove(activityId)}
        className={ACTION_BUTTON_CLASS}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

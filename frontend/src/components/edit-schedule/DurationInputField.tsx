import type { FocusEvent } from "react";

import { useTranslation } from "../../i18n/i18nStore";

type DurationInputFieldProps = {
  activityId: string;
  index: number;
  value: string;
  className: string;
  onChange: (value: string) => void;
  onBlur: (value: string, event: FocusEvent<HTMLInputElement>) => void;
};

export const DurationInputField = ({
  activityId,
  index,
  value,
  className,
  onChange,
  onBlur,
}: DurationInputFieldProps): JSX.Element => {
  const t = useTranslation();

  return (
    <input
      id={`duration-input-${activityId}`}
      data-testid={`duration-input-${index}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={(event) => onBlur(event.target.value, event)}
      placeholder={t.edit.durationPlaceholder}
      inputMode="numeric"
      maxLength={8}
      pattern="(?:\\d{1,2}|\\d{1,3}:\\d{2}|\\d{1,2}:\\d{2}:\\d{2})"
      className={className}
    />
  );
};

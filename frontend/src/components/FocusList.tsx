import { FocusListContent } from "./focus-list/FocusListContent";

export const FocusList = (): JSX.Element => {
  return (
    <div id="activities-section" data-testid="activities-section">
      <div id="focused-list" data-testid="focused-list" className="grid min-w-0 gap-1 md:gap-2">
        <FocusListContent />
      </div>
    </div>
  );
};

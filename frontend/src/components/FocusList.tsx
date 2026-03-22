import { FocusListContent } from "./focus-list/FocusListContent";
import { SectionCard } from "./ui/SectionCard";

export const FocusList = (): JSX.Element => {
  return (
    <SectionCard id="activities-section" dataTestId="activities-section">
      <div id="focused-list" data-testid="focused-list" className="grid min-w-0 gap-1 md:gap-2">
        <FocusListContent />
      </div>
    </SectionCard>
  );
};

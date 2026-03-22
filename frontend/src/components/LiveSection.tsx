import { LiveControlPanel } from "./live-section/LiveControlPanel";
import { LiveSummary } from "./live-section/LiveSummary";
import { LiveTopActions } from "./live-section/LiveTopActions";
import { SectionCard } from "./ui/SectionCard";

export const LiveSection = (): JSX.Element => {
  return (
    <SectionCard id="live-section" dataTestId="live-section">
      <div id="live-top" className="grid gap-2">
        <div className="flex items-start gap-2">
          <LiveSummary />
          <LiveTopActions />
        </div>
      </div>
      <LiveControlPanel />
    </SectionCard>
  );
};

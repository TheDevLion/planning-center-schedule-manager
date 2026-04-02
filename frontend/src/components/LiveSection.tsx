import { LiveControlPanel } from "./live-section/LiveControlPanel";
import { LiveSummary } from "./live-section/LiveSummary";
import { LiveTopActions } from "./live-section/LiveTopActions";

export const LiveSection = (): JSX.Element => {
  return (
    <div id="live-section" data-testid="live-section">
      <div id="live-top" className="grid gap-2">
        <div className="flex items-start gap-2">
          <LiveSummary />
          <LiveTopActions />
        </div>
      </div>
      <LiveControlPanel />
    </div>
  );
};

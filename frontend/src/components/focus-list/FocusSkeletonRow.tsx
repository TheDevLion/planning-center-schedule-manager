export const FocusSkeletonRow = (): JSX.Element => {
  return (
    <div className="flex min-h-[58px] animate-pulse items-center gap-3 rounded-[10px] border border-border bg-card-alt px-2.5 py-2 sm:min-h-16 sm:px-3 sm:py-2.5">
      <span className="h-8 w-8 shrink-0 rounded-full bg-border" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/5 rounded bg-border" />
        <div className="h-3 w-3/4 rounded bg-border" />
      </div>
    </div>
  );
};

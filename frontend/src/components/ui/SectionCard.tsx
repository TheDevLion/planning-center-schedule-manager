import type { ReactNode } from "react";

type SectionCardProps = {
  id: string;
  dataTestId: string;
  children: ReactNode;
};

export const SectionCard = ({
  id,
  dataTestId,
  children,
}: SectionCardProps): JSX.Element => {
  return (
    <section
      id={id}
      data-testid={dataTestId}
      className="overflow-hidden rounded-xl border border-border bg-card p-3.5 shadow-[0_4px_24px_rgba(15,23,42,0.12)] md:p-5"
    >
      {children}
    </section>
  );
};

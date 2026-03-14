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
      className="rounded-xl bg-white p-3 shadow-[0_4px_20px_rgba(15,23,42,0.08)] sm:p-[18px]"
    >
      {children}
    </section>
  );
};

type Props = {
  children: React.ReactNode;
  width?: "prose" | "default" | "wide";
};

const widthMap = {
  prose: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
};

export function PageShell({ children, width = "default" }: Props) {
  return (
    <div className="w-full">
      <div className={`${widthMap[width]} mx-auto px-6 md:px-10 lg:px-16`}>
        {children}
      </div>
    </div>
  );
}

import { Frame } from "@/components/ui/frame";
import { twMerge } from "tailwind-merge";

function Input({
  className,
  children,
  variant = "lifted",
  type,
  ...props
}: React.ComponentProps<"input"> & {
  variant?: "flat" | "lifted" | "simple";
}) {
  return (
    <Frame
      className={twMerge([
        "relative w-full",
        "[--color-frame-1-stroke:var(--color-primary)]/70",
        "[--color-frame-1-fill:var(--color-primary)]/10",
        "[--color-frame-2-stroke:transparent]",
        "[--color-frame-2-fill:transparent]",
        className,
      ])}
      paths={JSON.parse(
        '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","17","0"],["L","100% - 7","0"],["L","100% + 0","0% + 9.5"],["L","100% - 18","100% - 6"],["L","4","100% - 6"],["L","0","100% - 15"],["L","17","0"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","9","100% - 6"],["L","100% - 22","100% - 6"],["L","100% - 25","100% + 0"],["L","12","100% + 0"],["L","9","100% - 6"]]}]'
      )}
    >
      <input
        type={type}
        className="w-full outline-none relative placeholder:text-foreground/70"
        {...props}
      />
    </Frame>
  );
}

export { Input };

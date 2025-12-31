'use client';
import { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { type Paths, setupSvgRenderer } from "@left4code/svg-renderer";

function Frame({
  className,
  paths,
  children,
  padding = true,
  ...props
}: { paths: Paths; children?: React.ReactNode; padding?: boolean } & React.ComponentProps<"svg">) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && svgRef.current.parentElement) {
      const instance = setupSvgRenderer({
        el: svgRef.current,
        paths,
      });

      return () => instance.destroy();
    }
  }, [paths]);

  return (
    <div className={twMerge(["relative", className])}>
      <svg
        {...props}
        className="absolute inset-0 size-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        ref={svgRef}
      />
      <div className={twMerge(["relative z-10 w-full h-full", padding && "p-6"])}>
        {children}
      </div>
    </div>
  );
}

export { Frame };

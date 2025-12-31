'use client';
import { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { type Paths, setupSvgRenderer } from "@left4code/svg-renderer";

function Frame({
  className,
  paths,
  children,
  ...props
}: { paths: Paths; children?: React.ReactNode } & React.ComponentProps<"svg">) {
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
    <div className="relative size-full">
      <svg
        {...props}
        className={twMerge(["absolute inset-0 size-full", className])}
        xmlns="http://www.w3.org/2000/svg"
        ref={svgRef}
      />
      {children && (
        <div className="relative z-10 size-full p-4">
          {children}
        </div>
      )}
    </div>
  );
}

export { Frame };

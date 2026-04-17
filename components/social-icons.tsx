import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function InstagramIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...common}
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function VimeoIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...common}
      {...props}
    >
      <path d="M22 7.42c-.09 1.93-1.44 4.58-4.04 7.93C15.28 18.85 13.06 20.6 11.23 20.6c-1.13 0-2.09-1.03-2.88-3.08-.54-1.96-1.07-3.92-1.61-5.88-.6-2.05-1.24-3.08-1.92-3.08-.15 0-.67.3-1.56.9L2 7.82c.97-.85 1.93-1.7 2.87-2.55 1.29-1.12 2.26-1.71 2.91-1.77 1.53-.15 2.47.89 2.82 3.13.38 2.41.65 3.91.79 4.5.43 1.95.9 2.93 1.42 2.93.4 0 1-.64 1.81-1.91.8-1.27 1.23-2.24 1.29-2.91.12-1.16-.34-1.74-1.38-1.74-.49 0-1 .11-1.52.34 1.01-3.3 2.94-4.9 5.78-4.81 2.1.07 3.1 1.43 2.99 4.09z" />
    </svg>
  );
}

export function TikTokIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...common}
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

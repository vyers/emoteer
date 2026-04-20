import { Icons, type IconName } from '@emoteer/core';
import type { SVGAttributes } from 'react';

interface IconProps extends SVGAttributes<SVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16, width, height, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={width ?? size}
      height={height ?? size}
      aria-hidden="true"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={Icons[name]} />
    </svg>
  );
}

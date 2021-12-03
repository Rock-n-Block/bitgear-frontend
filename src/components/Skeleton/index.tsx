import React from 'react';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

interface ISkeleton extends SkeletonProps {
  colorScheme?: 'primary';
}

export const SkeletonLoader: React.FC<ISkeleton> = ({
  circle,
  width,
  height,
  borderRadius,
  style,
  colorScheme = 'primary',
}) => {
  let highlightColor;
  let baseColor;
  switch (colorScheme) {
    case 'primary':
      highlightColor = 'rgba(255, 255, 255, 0.07)';
      baseColor = '#0E1F43';
      break;
    default:
      highlightColor = 'rgba(255, 255, 255, 0.07)';
      baseColor = '#0E1F43';
  }
  return (
    <Skeleton
      style={style}
      circle={circle}
      width={width}
      height={height}
      borderRadius={borderRadius}
      highlightColor={highlightColor}
      baseColor={baseColor}
    />
  );
};

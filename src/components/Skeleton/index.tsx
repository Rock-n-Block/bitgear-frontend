/* eslint-disable react/require-default-props */

import React from 'react';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';
import cn from 'classnames';

import 'react-loading-skeleton/dist/skeleton.css';
import s from './style.module.scss';

interface ISkeleton extends SkeletonProps {
  colorScheme?: 'primary';
  widthMax?: boolean;
}

export const SkeletonLoader: React.FC<ISkeleton> = ({
  circle,
  width,
  height,
  borderRadius,
  style,
  colorScheme = 'primary',
  widthMax = false,
  className,
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
      className={cn(s.skeleton, { [s.skeleton_widthMax]: widthMax }, className)}
    />
  );
};

import { createElement, FC, ReactElement, useMemo } from 'react';
import ReactTooltip, { Effect, Offset, Place } from 'react-tooltip';
import cn from 'classnames';
import { noop } from 'lodash';

import { Event } from './Tooltip.types';

import './Tooltip.override.scss';
import styles from './Tooltip.module.scss';

export interface TooltipProps {
  name: string;
  target: ReactElement | string;
  content: ReactElement | string;
  event?: Event | string;
  tag?: 'span' | 'div';
  eventOff?: Event | string;
  place?: Place;
  effect?: Effect;
  clickable?: boolean;
  offset?: Offset;
  className?: string;
  onShow?: () => void;
  onHide?: () => void;
}

export const Tooltip: FC<TooltipProps> = ({
  name,
  target,
  content,
  event = 'mouseenter',
  eventOff = 'mouseleave',
  tag = 'span',
  place = 'bottom',
  effect = 'solid',
  clickable = false,
  offset = {},
  className,
  onShow = noop,
  onHide = noop,
}) => {
  const targetElement = createElement(
    tag,
    {
      'data-tip': '',
      'data-for': name,
      'data-event': event,
    },
    target,
  );

  const delayHide: number = useMemo(() => {
    return clickable ? 150 : 0;
  }, [clickable]);

  return (
    <>
      {targetElement}
      <ReactTooltip
        id={name}
        eventOff={eventOff}
        place={place}
        effect={effect}
        clickable={clickable}
        className={cn(styles.tooltip, className)}
        offset={offset}
        backgroundColor="white"
        delayHide={delayHide}
        afterShow={onShow}
        afterHide={onHide}
        border
      >
        <div className="tooltip-content">{content}</div>
      </ReactTooltip>
    </>
  );
};

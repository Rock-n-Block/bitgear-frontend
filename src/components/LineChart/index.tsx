import React from 'react';
import * as d3 from 'd3-path';
import { v1 as uuid } from 'uuid';

import s from './style.module.scss';

type TypeButtonProps = {
  data?: any;
};

export const LineChart: React.FC<TypeButtonProps> = React.memo(({ data = [] }) => {
  const [points, setPoints] = React.useState<string>();
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  // const [hover, setHover] = React.useState<boolean>(false);
  const [verticalLines, setVerticalLines] = React.useState<any[]>([]);
  // const [positionMouseX, setPositionMouseX] = React.useState<number>(0);
  // const [pointsVerticalLine, setPointsVerticalLine] = React.useState<string>();

  const refContainer = React.useRef<HTMLDivElement>(null);

  const resizePath = React.useCallback((array: number[], h: number) => {
    const min = Math.min(...array);
    const max = Math.max(...array);
    const amplitude = max - min;
    const newPath = array.map((item) => ((item - min) / amplitude) * h);
    return newPath;
  }, []);

  const handleResize = () => {
    if (!refContainer.current) return;
    setWidth(refContainer.current.offsetWidth);
    setHeight(refContainer.current.offsetHeight);
  };

  const drawVerticalLines = React.useCallback(() => {
    // console.log('drawVerticalLines:', data);
    const array = resizePath(data, height);
    const lines: any[] = [];
    const step = width / data.length;
    array.map((point: number, ip: number) => {
      const x = ip * step;
      const pathLine = d3.path();
      pathLine.moveTo(x, 0);
      pathLine.lineTo(x, height);
      let dy = -15;
      if (point < 30) dy = 20;
      let dx = -30;
      if (x < 60) dx = 0;
      if (x > width - 60) dx = -60;
      return lines.push(
        <g key={uuid()} className={s.verticalLine}>
          <path d={pathLine.toString()} />
          <circle cx={x} cy={point} r={6} />
          <text x={x + dx} y={point + dy}>
            {point.toString().slice(0, 8)}
          </text>
          <rect x={x - 0.5 * step} y={0} width={step} height={height} />
        </g>,
      );
    });
    setVerticalLines(lines);
  }, [resizePath, data, height, width]);

  const drawPath = React.useCallback(() => {
    // console.log('drawPath:', data);
    const array = resizePath(data, height);
    const path = d3.path();
    array.map((point: number, ip: number) => {
      const step = width / array.length;
      if (ip === 0) return path.moveTo(ip * step, point);
      return path.lineTo(ip * step, point);
    });
    setPoints(path.toString());
  }, [data, height, width, resizePath]);

  React.useEffect(() => {
    handleResize();
    document.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    drawPath();
    drawVerticalLines();
  }, [drawPath, drawVerticalLines, height, width]);

  return (
    <div
      ref={refContainer}
      className={s.chartContainer}
      // onFocus={() => setHover(true)}
      // onMouseEnter={() => setHover(true)}
      // onMouseLeave={() => setHover(false)}
      // onMouseMove={handleMoveVerticalLine}
    >
      <svg
        className={s.chart}
        xmlns="http://www.w3.org/2000/svg"
        // onMouseEnter={() => setHover(true)}
        // onMouseLeave={() => setHover(false)}
      >
        <path className={s.path} d={points} />
        {verticalLines.map((line) => line)}
      </svg>
    </div>
  );
});

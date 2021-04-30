import React from 'react';
import cns from 'classnames';
import * as d3 from 'd3-path';
import { v1 as uuid } from 'uuid';

import s from './style.module.scss';

type TypeLineChartProps = {
  data?: any;
  containerStyle?: any;
  svgStyle?: any;
  interactive?: boolean;
  chartHeight?: number;
  padding?: number;
};

export const LineChart: React.FC<TypeLineChartProps> = React.memo(
  ({
    data = [],
    containerStyle = {},
    svgStyle = {},
    interactive = false,
    chartHeight,
    padding = 0,
  }) => {
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
      const newPath = array.map((item) => {
        if (amplitude === 0) return h;
        return h - ((item - min) / amplitude) * h;
      });
      return newPath;
    }, []);

    const drawVerticalLines = React.useCallback(() => {
      // console.log('drawVerticalLines:', data);
      const h = chartHeight || height;
      const array = resizePath(data, h);
      const lines: any[] = [];
      const step = (width - padding * 2) / (data.length - 1);
      array.map((point: number, ip: number) => {
        const text = data ? data[ip] : '';
        const x = padding + ip * step;
        const y = point + padding;
        const pathLine = d3.path();
        pathLine.moveTo(x, 0);
        pathLine.lineTo(x, height);
        let dy = -15;
        if (y < 30) dy = 20;
        let dx = -15;
        if (x < 60) dx = 0;
        if (x > width - 60) dx = -30;
        return lines.push(
          <g key={uuid()} className={s.verticalLine}>
            <path d={pathLine.toString()} />
            <circle cx={x} cy={y} r={6} />
            <text x={x + dx} y={y + dy}>
              {String(text).slice(0, 8)}
            </text>
            <rect x={x - 0.5 * step} y={0} width={step} height={height} />
          </g>,
        );
      });
      setVerticalLines(lines);
    }, [resizePath, data, width, height, chartHeight, padding]);

    const drawPath = React.useCallback(() => {
      // console.log('drawPath:', data);
      const h = chartHeight || height;
      const array = resizePath(data, h);
      const path = d3.path();
      const step = (width - padding * 2) / (array.length - 1);
      array.map((point: number, ip: number) => {
        const x = padding + ip * step;
        const y = point + padding;
        if (ip === 0) return path.moveTo(x, y);
        return path.lineTo(x, y);
      });
      setPoints(path.toString());
    }, [data, width, resizePath, chartHeight, height, padding]);

    const handleResize = () => {
      if (!refContainer.current) return;
      setWidth(refContainer.current.offsetWidth);
      setHeight(refContainer.current.offsetHeight);
    };

    React.useEffect(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      if (width === 0) return;
      drawPath();
      if (interactive) drawVerticalLines();
    }, [interactive, drawPath, drawVerticalLines, height, width]);

    return (
      <div
        ref={refContainer}
        className={cns(s.chartContainer, containerStyle)}
        // onFocus={() => setHover(true)}
        // onMouseEnter={() => setHover(true)}
        // onMouseLeave={() => setHover(false)}
        // onMouseMove={handleMoveVerticalLine}
      >
        <svg
          className={cns(s.chart, svgStyle)}
          xmlns="http://www.w3.org/2000/svg"
          // onMouseEnter={() => setHover(true)}
          // onMouseLeave={() => setHover(false)}
        >
          <path className={s.path} d={points} />
          {verticalLines.map((line) => line)}
        </svg>
      </div>
    );
  },
);

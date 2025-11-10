import ReactECharts from 'echarts-for-react';
import { ECOption } from 'echarts-for-react/lib/types';
import React from 'react';

interface BaseChartProps {
  option: ECOption;
  style?: React.CSSProperties;
}

const BaseChart: React.FC<BaseChartProps> = ({ option, style }) => {
  const defaultOption: ECOption = {
    grid: { top: 40, right: 30, bottom: 30, left: 60 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      borderColor: '#374151',
      textStyle: {
        color: '#E5E7EB',
      },
    },
    textStyle: {
      fontFamily: 'inherit',
      color: '#9CA3AF'
    },
    ...option,
  };

  return (
    <ReactECharts
      option={defaultOption}
      style={{ height: '100%', width: '100%', ...style }}
      notMerge={true}
      lazyUpdate={true}
      theme="dark"
    />
  );
};

export default BaseChart;

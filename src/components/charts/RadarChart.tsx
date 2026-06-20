import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { ScoreBreakdown } from '../../types';

interface RadarChartProps {
  data: ScoreBreakdown;
  size?: number;
}

const labelMap: Record<keyof ScoreBreakdown, string> = {
  speed: '速度',
  accuracy: '准确率',
  streak: '连对',
  hints: '独立思考',
  knowledge: '知识点掌握',
};

export function RadarChart({ data, size = 300 }: RadarChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    subject: labelMap[key as keyof ScoreBreakdown],
    value,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width={size} height={size}>
      <RechartsRadarChart data={chartData} outerRadius="80%">
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          tickCount={5}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: 'white',
          }}
          formatter={(value: number) => [`${value}分`, '得分']}
        />
        <Radar
          name="评分"
          dataKey="value"
          stroke="#00d4ff"
          strokeWidth={2}
          fill="url(#scoreGradient)"
          fillOpacity={0.5}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}

import { ResponsiveContainer, Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface RadarChartProps {
  indicators: Array<{
    name: string;
    score: number;
    description: string;
    weight: number;
  }>;
}

export const RadarChart = ({ indicators }: RadarChartProps) => {
  const data = indicators.map(indicator => ({
    subject: indicator.name.length > 15 
      ? indicator.name.substring(0, 15) + '...' 
      : indicator.name,
    fullName: indicator.name,
    A: indicator.score,
    fullMark: 100
  }));

  return (
    <div className="w-full h-96" data-testid="radar-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="subject" 
            className="text-xs"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Radar
            name="Score IA"
            dataKey="A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
      
      {/* Légende avec noms complets */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium">Indicateurs :</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex justify-between">
              <span>{indicator.name}</span>
              <span className="font-medium">{indicator.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
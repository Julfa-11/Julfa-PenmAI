
'use client';

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface ResultsChartProps {
  principal: number;
  rate: number;
  timeInYears: number;
  compounding: number;
}

const chartConfig = {
  totalValue: {
    label: 'Total Value',
    color: 'hsl(var(--chart-1))',
  },
  principal: {
    label: 'Principal',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


export default function ResultsChart({ principal, rate, timeInYears, compounding }: ResultsChartProps) {
  const chartData = useMemo(() => {
    if (principal <= 0 || rate <= 0 || timeInYears <= 0) return [];
    
    const data: { year: string; totalValue: number; principal: number }[] = [];
    const r = rate / 100;

    const periods = Math.ceil(timeInYears);

    for (let i = 0; i <= periods; i++) {
        const t = i;
        const amount = principal * Math.pow(1 + (r / compounding), compounding * t);
        data.push({
            year: `Year ${i}`,
            totalValue: parseFloat(amount.toFixed(2)),
            principal: principal,
        });
    }
    return data;
  }, [principal, rate, timeInYears, compounding]);

  const formatCurrencyForAxis = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Maturity Projection</CardTitle>
        <CardDescription>Visual representation of your investment growth over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorTotalValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-totalValue)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-totalValue)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-principal)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-principal)" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  tickFormatter={formatCurrencyForAxis}
                />
                <Tooltip
                  cursor={true}
                  content={
                    <ChartTooltipContent
                        formatter={(value, name) => (
                        <div className="flex flex-col">
                            <span className="capitalize">{name?.toString().replace(/([A-Z])/g, ' $1')}</span>
                            <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value as number)}</span>
                        </div>
                        )}
                        indicator="dot"
                    />
                  }
                />
                <Area type="monotone" dataKey="principal" fill="url(#colorPrincipal)" stroke="var(--color-principal)" stackId="1" />
                <Area type="monotone" dataKey="totalValue" fill="url(#colorTotalValue)" stroke="var(--color-totalValue)" stackId="1" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              Enter valid details to see projection.
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

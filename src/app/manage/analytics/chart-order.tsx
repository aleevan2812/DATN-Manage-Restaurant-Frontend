'use client';

import React, { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetRevenueQuery } from '@/queries/useOrder';

// const chartData = [
//   { date: '2024-04-01', revenue: 222, order: 150 },
//   { date: '2024-04-02', revenue: 97, order: 180 },
//   { date: '2024-04-03', revenue: 167, order: 120 },
//   { date: '2024-04-04', revenue: 242, order: 260 },
//   { date: '2024-04-05', revenue: 373, order: 290 },
//   { date: '2024-04-06', revenue: 301, order: 340 },
//   { date: '2024-04-07', revenue: 245, order: 180 },
//   { date: '2024-04-08', revenue: 409, order: 320 },
//   { date: '2024-04-09', revenue: 59, order: 110 },
//   { date: '2024-04-10', revenue: 261, order: 190 },
//   { date: '2024-04-11', revenue: 327, order: 350 },
//   { date: '2024-04-12', revenue: 292, order: 210 },
//   { date: '2024-04-13', revenue: 342, order: 380 },
//   { date: '2024-04-14', revenue: 137, order: 220 },
//   { date: '2024-04-15', revenue: 120, order: 170 },
//   { date: '2024-04-16', revenue: 138, order: 190 },
//   { date: '2024-04-17', revenue: 446, order: 360 },
//   { date: '2024-04-18', revenue: 364, order: 410 },
//   { date: '2024-04-19', revenue: 243, order: 180 },
//   { date: '2024-04-20', revenue: 89, order: 150 },
//   { date: '2024-04-21', revenue: 137, order: 200 },
//   { date: '2024-04-22', revenue: 224, order: 170 },
//   { date: '2024-04-23', revenue: 138, order: 230 },
//   { date: '2024-04-24', revenue: 387, order: 290 },
//   { date: '2024-04-25', revenue: 215, order: 250 },
//   { date: '2024-04-26', revenue: 75, order: 130 },
//   { date: '2024-04-27', revenue: 383, order: 420 },
//   { date: '2024-04-28', revenue: 122, order: 180 },
//   { date: '2024-04-29', revenue: 315, order: 240 },
//   { date: '2024-04-30', revenue: 454, order: 380 },

//   { date: '2024-05-31', revenue: 178, order: 230 },
//   { date: '2024-06-01', revenue: 178, order: 200 },
//   { date: '2024-06-02', revenue: 470, order: 410 },
//   { date: '2024-06-03', revenue: 103, order: 160 },
//   { date: '2024-06-04', revenue: 439, order: 380 },
//   { date: '2024-06-05', revenue: 88, order: 140 },
//   { date: '2024-06-06', revenue: 294, order: 250 },
//   { date: '2024-06-07', revenue: 323, order: 370 },
//   { date: '2024-06-08', revenue: 385, order: 320 },
//   { date: '2024-06-09', revenue: 438, order: 480 },
//   { date: '2024-06-10', revenue: 155, order: 200 },
//   { date: '2024-06-11', revenue: 92, order: 150 },
//   { date: '2024-06-12', revenue: 492, order: 420 },
//   { date: '2024-06-13', revenue: 81, order: 130 },
//   { date: '2024-06-14', revenue: 426, order: 380 },
//   { date: '2024-06-15', revenue: 307, order: 350 },
//   { date: '2024-06-16', revenue: 371, order: 310 },
//   { date: '2024-06-17', revenue: 475, order: 520 },
//   { date: '2024-06-18', revenue: 107, order: 170 },
//   { date: '2024-06-19', revenue: 341, order: 290 },
//   { date: '2024-06-20', revenue: 408, order: 450 },
//   { date: '2024-06-21', revenue: 169, order: 210 },
//   { date: '2024-06-22', revenue: 317, order: 270 },
//   { date: '2024-06-23', revenue: 480, order: 530 },
//   { date: '2024-06-24', revenue: 132, order: 180 },
//   { date: '2024-06-25', revenue: 141, order: 190 },
//   { date: '2024-06-26', revenue: 434, order: 380 },
//   { date: '2024-06-27', revenue: 448, order: 490 },
//   { date: '2024-06-28', revenue: 149, order: 200 },
//   { date: '2024-06-29', revenue: 103, order: 160 },
//   { date: '2024-06-30', revenue: 446, order: 400 },
// ];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  revenue: {
    label: 'Doanh thu',
    color: 'hsl(var(--chart-1))',
  },
  order: {
    label: 'Đơn hàng',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function ChartOrder() {
  const { data, refetch } = useGetRevenueQuery();
  const chartData = useMemo(() => data?.payload.data ?? [], [data]);
  const [timeRange, setTimeRange] = React.useState('90d');
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <Card>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>Biểu đồ doanh thu 3 tháng</CardTitle>
          <CardDescription>
            Tổng doanh thu các đơn hàng đã thanh toán trong 3 tháng gần nhất
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className='w-[160px] rounded-lg sm:ml-auto'
            aria-label='Select a value'
          >
            <SelectValue placeholder='Last 3 months' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='90d' className='rounded-lg'>
              3 tháng gần nhất
            </SelectItem>
            <SelectItem value='30d' className='rounded-lg'>
              30 ngày gần nhất
            </SelectItem>
            <SelectItem value='7d' className='rounded-lg'>
              7 ngày gần nhất
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id='fillRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-revenue)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-revenue)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillOrder' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-order)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-order)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='order'
              type='natural'
              fill='url(#fillOrder)'
              stroke='var(--color-order)'
              stackId='a'
            />
            <Area
              dataKey='revenue'
              type='natural'
              fill='url(#fillRevenue)'
              stroke='var(--color-revenue)'
              stackId='a'
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

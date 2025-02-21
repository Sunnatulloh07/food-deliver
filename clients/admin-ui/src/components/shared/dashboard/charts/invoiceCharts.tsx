"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


const analyticsData = [
  { name: 'Jan 23', count: 700 },
  { name: 'Feb 23', count: 900 },
  { name: 'Mar 23', count: 400 },
  { name: 'Apr 23', count: 800 },
  { name: 'May 23', count: 400 },
  { name: 'Jun 23', count: 800 },
];

function invoiceCharts() {
  return (
    <div className="w-full h-[60vh] mt-10">
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <AreaChart
          data={analyticsData}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" stroke="#4d62d9"
            fill="#4d62d9"
            strokeWidth={2}
            color='#4d62d9'
          />
          <YAxis/>
          <Tooltip/>
          <Area
            type="monotone"
            dataKey="count"
            stroke="#4d62d9"
            fill="#4d62d9"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default invoiceCharts;

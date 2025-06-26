
import React, { useMemo } from 'react';
import { Activity, ActivityCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector, Label } from 'recharts';
import { activityService } from '../services/activityService';
import { CATEGORIES, CATEGORY_COLORS } from '../constants';
import EmptyState from './EmptyState';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface AnalyticsViewProps {
  activities: Activity[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ activities }) => {
  const { 
    activitiesPerCategory, 
    timePerCategory, 
    totalActivities, 
    completedActivities, 
    totalTimeSpent 
  } = useMemo(() => activityService.getAnalyticsData(activities), [activities]);

  const CATEGORY_HEX_COLORS: { [key in ActivityCategory]: string } = {
    [ActivityCategory.WORK]: '#60A5FA', // Blue
    [ActivityCategory.PERSONAL]: '#4ADE80', // Green
    [ActivityCategory.FITNESS]: '#FACC15', // Yellow
    [ActivityCategory.LEARNING]: '#A78BFA', // Purple
    [ActivityCategory.SOCIAL]: '#F472B6', // Pink
    [ActivityCategory.OTHER]: '#9CA3AF', // Gray
  };
  
  // Custom active shape for PieChart to display more info
    const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
            {payload.name}
        </text>
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
        />
        <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff" className="text-sm">{`${activityService.formatDuration(value)}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
            {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
        </g>
    );
    };

    const [activeIndex, setActiveIndex] = React.useState(0);
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };


  if (activities.length === 0) {
    return <EmptyState title="No Data for Analytics" message="Add some activities to see your stats!" />;
  }

  const summaryCardClass = "bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300";
  const summaryTitleClass = "text-lg font-semibold text-primary-light mb-2";
  const summaryValueClass = "text-4xl font-bold text-white";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <InformationCircleIcon className="w-8 h-8 mr-3 text-primary-light" />
            Activity Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={summaryCardClass}>
            <h3 className={summaryTitleClass}>Total Activities</h3>
            <p className={summaryValueClass}>{totalActivities}</p>
          </div>
          <div className={summaryCardClass}>
            <h3 className={summaryTitleClass}>Completed</h3>
            <p className={summaryValueClass}>{completedActivities} <span className="text-xl text-gray-400">({totalActivities > 0 ? Math.round((completedActivities/totalActivities)*100) : 0}%)</span></p>
          </div>
          <div className={summaryCardClass}>
            <h3 className={summaryTitleClass}>Total Time Tracked</h3>
            <p className={summaryValueClass}>{activityService.formatDuration(totalTimeSpent)}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <ChartBarIcon className="w-7 h-7 mr-2 text-primary-light" />
            Activities per Category
        </h3>
        {activitiesPerCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
            <BarChart data={activitiesPerCategory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} />
                <YAxis allowDecimals={false} tick={{ fill: '#A0AEC0' }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', borderRadius: '0.5rem' }} 
                    labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
                    itemStyle={{ color: '#A0AEC0' }}
                />
                <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                <Bar dataKey="count" name="Activities" radius={[4, 4, 0, 0]}>
                    {activitiesPerCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_HEX_COLORS[entry.name as ActivityCategory]} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        ) : <p className="text-gray-400 text-center py-8">Not enough data for this chart.</p>}
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <ChartPieIcon className="w-7 h-7 mr-2 text-primary-light" />
            Time Spent per Category
        </h3>
        {timePerCategory.filter(d => d.value > 0).length > 0 ? (
            <ResponsiveContainer width="100%" height={450}>
            <PieChart>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={timePerCategory.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="75%"
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    paddingAngle={2}
                >
                {timePerCategory.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_HEX_COLORS[entry.name as ActivityCategory]} />
                ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', borderRadius: '0.5rem' }} 
                    formatter={(value: number) => activityService.formatDuration(value)}
                />
                 <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ color: '#E2E8F0', marginTop: '20px' }} 
                 />
            </PieChart>
            </ResponsiveContainer>
        ) : <p className="text-gray-400 text-center py-8">No time tracked yet or activities have no duration.</p>}
      </div>
    </div>
  );
};

export default AnalyticsView;
    
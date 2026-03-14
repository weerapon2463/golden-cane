// Compare.tsx — Crop comparison page with multiple chart types
// Design: Modern Agri-Tech Dashboard
// Charts: Bar, Line, Radar, Pie, Area, Scatter

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarRadiusAxis
} from 'recharts';
import { BarChart3, TrendingUp, Target, PieChart as PieIcon, Activity, Zap, Plus, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import CropSelector from '@/components/CropSelector';
import AddCropDialog from '@/components/AddCropDialog';
import { useCrops } from '@/contexts/CropContext';
import { toast } from 'sonner';

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const CHART_TYPES = [
  { id: 'bar', label: 'แท่ง', icon: BarChart3, desc: 'เปรียบเทียบรายได้/ต้นทุน/กำไร' },
  { id: 'radar', label: 'เรดาร์', icon: Target, desc: 'เปรียบเทียบหลายมิติ' },
  { id: 'area', label: 'พื้นที่', icon: Activity, desc: 'รายได้สะสมตลอดปี' },
  { id: 'pie', label: 'วงกลม', icon: PieIcon, desc: 'สัดส่วนรายได้รวม' },
  { id: 'line', label: 'เส้น', icon: TrendingUp, desc: 'แนวโน้มต้นทุนรายเดือน' },
  { id: 'scatter', label: 'กระจาย', icon: Zap, desc: 'ROI vs ความเสี่ยง' },
];

const CustomTooltipStyle = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          {p.unit || ''}
        </p>
      ))}
    </div>
  );
};

export default function Compare() {
  const { getSelectedCrops, allCrops, removeCustomCrop, landArea, setLandArea } = useCrops();
  const [addOpen, setAddOpen] = useState(false);
  const [activeChart, setActiveChart] = useState('bar');
  const [barMetric, setBarMetric] = useState<'revenue' | 'cost' | 'profit' | 'roi'>('profit');

  const crops = getSelectedCrops();

  // Data for bar chart
  const barData = [
    {
      name: 'รายได้/ไร่',
      ...Object.fromEntries(crops.map(c => [c.name, c.revenuePerRai])),
    },
    {
      name: 'ต้นทุน/ไร่',
      ...Object.fromEntries(crops.map(c => [c.name, c.totalCost])),
    },
    {
      name: 'กำไร/ไร่',
      ...Object.fromEntries(crops.map(c => [c.name, c.netProfitPerRai])),
    },
  ];

  const singleBarData = crops.map(c => ({
    name: c.name,
    emoji: c.emoji,
    value: barMetric === 'revenue' ? c.revenuePerRai
      : barMetric === 'cost' ? c.totalCost
      : barMetric === 'profit' ? c.netProfitPerRai
      : c.roi,
    color: c.colorHex,
  }));

  // Radar data
  const radarData = [
    { subject: 'รายได้', fullMark: 15000 },
    { subject: 'กำไร', fullMark: 10000 },
    { subject: 'ทนแล้ง', fullMark: 5 },
    { subject: 'ทนน้ำท่วม', fullMark: 5 },
    { subject: 'ตลาด', fullMark: 5 },
    { subject: 'ความยากในการดูแล', fullMark: 5 },
  ].map(d => {
    const row: Record<string, number | string> = { subject: d.subject, fullMark: d.fullMark };
    crops.forEach(c => {
      if (d.subject === 'รายได้') row[c.name] = Math.min(d.fullMark, c.revenuePerRai / 1000);
      else if (d.subject === 'กำไร') row[c.name] = Math.min(d.fullMark, Math.max(0, c.netProfitPerRai / 1000));
      else if (d.subject === 'ทนแล้ง') row[c.name] = c.droughtResistance;
      else if (d.subject === 'ทนน้ำท่วม') row[c.name] = c.floodResistance;
      else if (d.subject === 'ตลาด') row[c.name] = c.marketDemand;
      else if (d.subject === 'ความยากในการดูแล') row[c.name] = c.difficulty;
    });
    return row;
  });

  // Area chart — cumulative monthly revenue
  const areaData = MONTHS.map((month, i) => {
    const row: Record<string, string | number> = { month };
    crops.forEach(c => {
      const cumulative = c.monthlyRevenue.slice(0, i + 1).reduce((a, b) => a + b, 0);
      row[c.name] = cumulative;
    });
    return row;
  });

  // Pie chart
  const pieData = crops.map(c => ({
    name: c.name,
    value: Math.max(0, c.revenuePerRai),
    color: c.colorHex,
  }));

  // Line chart — monthly cost
  const lineData = MONTHS.map((month, i) => {
    const row: Record<string, string | number> = { month };
    crops.forEach(c => {
      row[c.name] = c.monthlyCost[i];
    });
    return row;
  });

  // Scatter — ROI vs difficulty
  const scatterData = crops.map(c => ({
    name: c.name,
    x: c.difficulty,
    y: c.roi,
    z: c.revenuePerRai / 1000,
    color: c.colorHex,
  }));

  const metricLabels = {
    revenue: 'รายได้/ไร่ (บาท)',
    cost: 'ต้นทุน/ไร่ (บาท)',
    profit: 'กำไร/ไร่ (บาท)',
    roi: 'ROI (%)',
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-[oklch(0.22_0.06_155)] py-10">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
              เปรียบเทียบพืช
            </h1>
            <p className="text-white/60">เลือกพืชที่ต้องการเปรียบเทียบ และดูกราฟวิเคราะห์หลายรูปแบบ</p>
          </motion.div>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Crop selector */}
        <CropSelector onAddCrop={() => setAddOpen(true)} />

        {crops.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">เลือกพืชอย่างน้อย 1 ชนิดเพื่อดูกราฟ</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {crops.map(crop => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-border rounded-2xl p-4 relative"
                  style={{ borderLeftColor: crop.colorHex, borderLeftWidth: 4 }}
                >
                  {crop.isCustom && (
                    <button
                      onClick={() => { removeCustomCrop(crop.id); toast.success(`ลบ "${crop.name}" แล้ว`); }}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{crop.emoji}</span>
                    <span className="font-bold text-foreground" style={{ fontFamily: 'Prompt, sans-serif' }}>
                      {crop.name}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">รายได้</span>
                      <span className="font-semibold">{crop.revenuePerRai.toLocaleString()} ฿</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ต้นทุน</span>
                      <span className="font-semibold">{crop.totalCost.toLocaleString()} ฿</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">กำไร</span>
                      <span className={`font-bold ${crop.netProfitPerRai >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        {crop.netProfitPerRai >= 0 ? '+' : ''}{crop.netProfitPerRai.toLocaleString()} ฿
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROI</span>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0" style={{ color: crop.colorHex }}>
                        {crop.roi}%
                      </Badge>
                    </div>
                    <div className="border-t border-border/30 pt-1 mt-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">เก็บเกี่ยว/ปี</span>
                        <span className="font-semibold">{crop.harvestsPerYear} ครั้ง</span>
                      </div>
                      {crop.canRatoon && (
                        <div className="flex justify-between mt-0.5">
                          <span className="text-muted-foreground">เก็บตอ</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0" style={{ borderColor: crop.colorHex, color: crop.colorHex }}>
                            {crop.ratoonYears} ปี
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart type selector */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  เลือกรูปแบบกราฟ
                </h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {CHART_TYPES.map(ct => (
                  <button
                    key={ct.id}
                    onClick={() => setActiveChart(ct.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm ${
                      activeChart === ct.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/40 text-muted-foreground'
                    }`}
                  >
                    <ct.icon className="w-5 h-5" />
                    <span className="font-medium text-xs">{ct.label}</span>
                    <span className="text-xs opacity-70 text-center leading-tight hidden md:block">{ct.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Charts */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Prompt, sans-serif' }}>
                  {CHART_TYPES.find(c => c.id === activeChart)?.desc}
                </CardTitle>
                <CardDescription>
                  {CHART_TYPES.find(c => c.id === activeChart)?.label} — เปรียบเทียบ {crops.map(c => c.name).join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Bar Chart */}
                {activeChart === 'bar' && (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(Object.keys(metricLabels) as Array<keyof typeof metricLabels>).map(m => (
                        <button
                          key={m}
                          onClick={() => setBarMetric(m)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                            barMetric === m
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          {metricLabels[m]}
                        </button>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={360}>
                      <BarChart data={singleBarData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltipStyle />} />
                        <Bar dataKey="value" name={metricLabels[barMetric]} radius={[6, 6, 0, 0]}>
                          {singleBarData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Radar Chart */}
                {activeChart === 'radar' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis tick={{ fontSize: 10 }} />
                      {crops.map(c => (
                        <Radar
                          key={c.id}
                          name={`${c.emoji} ${c.name}`}
                          dataKey={c.name}
                          stroke={c.colorHex}
                          fill={c.colorHex}
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend />
                      <Tooltip content={<CustomTooltipStyle />} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}

                {/* Area Chart */}
                {activeChart === 'area' && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">รายได้สะสมตลอด 12 เดือน (บาท/ไร่)</p>
                    <ResponsiveContainer width="100%" height={360}>
                      <AreaChart data={areaData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltipStyle />} />
                        <Legend />
                        {crops.map(c => (
                          <Area
                            key={c.id}
                            type="monotone"
                            dataKey={c.name}
                            stroke={c.colorHex}
                            fill={c.colorHex}
                            fillOpacity={0.15}
                            strokeWidth={2}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Pie Chart */}
                {activeChart === 'pie' && (
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <ResponsiveContainer width="100%" height={360}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={140}
                          innerRadius={60}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={true}
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${v.toLocaleString()} บาท/ไร่`, 'รายได้']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Line Chart */}
                {activeChart === 'line' && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">ต้นทุนรายเดือนโดยประมาณ (บาท/ไร่)</p>
                    <ResponsiveContainer width="100%" height={360}>
                      <LineChart data={lineData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltipStyle />} />
                        <Legend />
                        {crops.map(c => (
                          <Line
                            key={c.id}
                            type="monotone"
                            dataKey={c.name}
                            stroke={c.colorHex}
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: c.colorHex }}
                            activeDot={{ r: 6 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Scatter Chart */}
                {activeChart === 'scatter' && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      แกน X = ความยากในการปลูก (1=ง่าย, 5=ยาก) | แกน Y = ROI (%) | ขนาดจุด = รายได้
                    </p>
                    <ResponsiveContainer width="100%" height={360}>
                      <ScatterChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="ความยาก"
                          domain={[0, 6]}
                          tick={{ fontSize: 12 }}
                          label={{ value: 'ความยาก', position: 'insideBottom', offset: -5, fontSize: 12 }}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="ROI"
                          tick={{ fontSize: 12 }}
                          label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            const crop = crops.find(c => c.difficulty === d.x && c.roi === d.y);
                            return (
                              <div className="bg-white border border-border rounded-xl shadow-lg p-3 text-sm">
                                <p className="font-bold">{crop?.emoji} {crop?.name}</p>
                                <p>ความยาก: {d.x}/5</p>
                                <p>ROI: {d.y}%</p>
                                <p>รายได้: {(d.z * 1000).toLocaleString()} บาท/ไร่</p>
                              </div>
                            );
                          }}
                        />
                        {crops.map(c => (
                          <Scatter
                            key={c.id}
                            name={`${c.emoji} ${c.name}`}
                            data={[{ x: c.difficulty, y: c.roi, z: c.revenuePerRai / 1000 }]}
                            fill={c.colorHex}
                          />
                        ))}
                        <Legend />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed comparison table */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Prompt, sans-serif' }}>ตารางเปรียบเทียบละเอียด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 pr-4 font-semibold text-muted-foreground w-40">รายการ</th>
                        {crops.map(c => (
                          <th key={c.id} className="text-center py-3 px-3 font-semibold min-w-[120px]">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xl">{c.emoji}</span>
                              <span style={{ color: c.colorHex }}>{c.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'ผลผลิต (ตัน/ไร่)', key: 'yieldPerRai', format: (v: number) => v.toFixed(1) },
                        { label: 'ราคา (บาท/ตัน)', key: 'pricePerTon', format: (v: number) => v.toLocaleString() },
                        { label: 'จำนวนครั้งเก็บเกี่ยว/ปี', key: 'harvestsPerYear', format: (v: number) => `${v} ครั้ง` },
                        { label: 'ระยะเวลาเก็บครั้งแรก', key: 'firstHarvestMonths', format: (v: number) => `${v} เดือน` },
                        { label: 'เก็บตอได้หรือไม่', key: 'canRatoon', format: (v: boolean) => v ? 'ได้' : 'ไม่ได้' },
                        { label: 'จำนวนปีที่เก็บตอได้', key: 'ratoonYears', format: (v: number) => v > 0 ? `${v} ปี` : 'ไม่มี' },
                        { label: 'รายได้/ไร่ (บาท)', key: 'revenuePerRai', format: (v: number) => v.toLocaleString(), highlight: true },
                        { label: 'ต้นทุนรวม/ไร่ (บาท)', key: 'totalCost', format: (v: number) => v.toLocaleString() },
                        { label: 'กำไรสุทธิ/ไร่ (บาท)', key: 'netProfitPerRai', format: (v: number) => (v >= 0 ? '+' : '') + v.toLocaleString(), highlight: true },
                        { label: 'ROI (%)', key: 'roi', format: (v: number) => `${v}%`, highlight: true },
                        { label: 'ระยะเวลาปลูก (เดือน)', key: 'growthMonths', format: (v: number) => `${v} เดือน` },
                        { label: 'ความยากในการดูแล (1 = ง่าย, 5 = ยาก)', key: 'difficulty', format: (v: number) => '★'.repeat(v) + ' / ' + '☆'.repeat(5 - v) },
                        { label: 'ความต้องการตลาด', key: 'marketDemand', format: (v: number) => '★'.repeat(v) + ' / ' + '☆'.repeat(5 - v) },
                        { label: 'ทนแห้ง (ยิ่งมาก = ทนได้ดี)', key: 'droughtResistance', format: (v: number) => '★'.repeat(v) + ' / ' + '☆'.repeat(5 - v) },
                        { label: 'ทนน้ำท่วม', key: 'floodResistance', format: (v: number) => '★'.repeat(v) + ' / ' + '☆'.repeat(5 - v) },
                        { label: 'ฤดูเก็บเกี่ยว', key: 'harvestSeason', format: (v: string) => v },
                      ].map(({ label, key, format, highlight }) => {
                        const values = crops.map(c => c[key as keyof typeof c] as number);
                        const maxVal = typeof values[0] === 'number' ? Math.max(...values as number[]) : null;
                        return (
                          <tr key={key} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 pr-4 text-muted-foreground font-medium">{label}</td>
                            {crops.map(c => {
                              const val = c[key as keyof typeof c] as number | string;
                              const isMax = typeof val === 'number' && val === maxVal && ['revenuePerRai', 'netProfitPerRai', 'roi', 'marketDemand', 'droughtResistance', 'floodResistance'].includes(key);
                              return (
                                <td key={c.id} className={`text-center py-2.5 px-3 ${isMax ? 'font-bold' : ''}`}>
                                  <span
                                    className={`${highlight && isMax ? 'px-2 py-0.5 rounded-full text-white text-xs' : ''}`}
                                    style={highlight && isMax ? { backgroundColor: c.colorHex } : {}}
                                  >
                                    {(format as (v: any) => string)(val)}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Advantages/Disadvantages */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {crops.map(crop => (
                <Card key={crop.id} className="border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
                      <span className="text-2xl">{crop.emoji}</span>
                      <span style={{ color: crop.colorHex }}>{crop.name}</span>
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed">{crop.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1.5">ข้อดี</p>
                      <ul className="space-y-1">
                        {crop.advantages.slice(0, 3).map((a, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">✓</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-destructive mb-1.5">ข้อควรระวัง</p>
                      <ul className="space-y-1">
                        {crop.disadvantages.slice(0, 2).map((d, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <span className="text-destructive mt-0.5">!</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-1 border-t border-border/30 space-y-1.5">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">พื้นที่เหมาะสม:</span> {crop.bestRegions.join(', ')}
                      </p>
                      <div className="bg-muted/30 rounded-lg p-2">
                        <p className="text-xs font-semibold text-foreground mb-1">เก็บเกี่ยว & เก็บตอ</p>
                        <p className="text-xs text-foreground leading-relaxed">{crop.ratoonInfo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <AddCropDialog open={addOpen} onClose={() => setAddOpen(false)} />

      {/* Footer */}
      <footer className="bg-[oklch(0.15_0.05_155)] py-8 mt-16">
        <div className="container">
          <div className="text-center text-white/40 text-sm mb-4">
            <p>© 2026 อ้อยทอง — ที่ปรึกษาเกษตรกรรายใหม่</p>
          </div>
          <div className="text-center text-white/50 text-xs border-t border-white/10 pt-4">
            <p className="mb-1">สร้างสรรค์โดย</p>
            <p className="font-medium text-white/70">นาย วีระพล จุ้ยม่วง (นัท)</p>
            <p className="text-white/40 mt-1">LINE: NUT2463</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

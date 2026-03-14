// Trends.tsx — Price trends and market analysis
// Design: Modern Agri-Tech Dashboard

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ข้อมูลราคาย้อนหลัง 5 ปี (จำลอง)
const PRICE_HISTORY = [
  { year: '2562', อ้อย: 900, ข้าว: 9500, ข้าวโพด: 7200, มันสำปะหลัง: 2200 },
  { year: '2563', อ้อย: 850, ข้าว: 10200, ข้าวโพด: 7800, มันสำปะหลัง: 2400 },
  { year: '2564', อ้อย: 950, ข้าว: 9800, ข้าวโพด: 8200, มันสำปะหลัง: 2600 },
  { year: '2565', อ้อย: 1000, ข้าว: 11000, ข้าวโพด: 9500, มันสำปะหลัง: 3000 },
  { year: '2566', อ้อย: 1050, ข้าว: 10500, ข้าวโพด: 8800, มันสำปะหลัง: 2800 },
  { year: '2567', อ้อย: 1080, ข้าว: 11200, ข้าวโพด: 8500, มันสำปะหลัง: 2750 },
  { year: '2568 (คาด)', อ้อย: 1100, ข้าว: 11500, ข้าวโพด: 8700, มันสำปะหลัง: 2900 },
];

const MONTHLY_PRICE_2567 = [
  { month: 'ม.ค.', อ้อย: 1020, ข้าว: 10800, ข้าวโพด: 8300, มันสำปะหลัง: 2650 },
  { month: 'ก.พ.', อ้อย: 1030, ข้าว: 10900, ข้าวโพด: 8400, มันสำปะหลัง: 2700 },
  { month: 'มี.ค.', อ้อย: 1050, ข้าว: 11000, ข้าวโพด: 8500, มันสำปะหลัง: 2720 },
  { month: 'เม.ย.', อ้อย: 1060, ข้าว: 11100, ข้าวโพด: 8600, มันสำปะหลัง: 2740 },
  { month: 'พ.ค.', อ้อย: 1070, ข้าว: 11200, ข้าวโพด: 8700, มันสำปะหลัง: 2760 },
  { month: 'มิ.ย.', อ้อย: 1065, ข้าว: 11150, ข้าวโพด: 8650, มันสำปะหลัง: 2750 },
  { month: 'ก.ค.', อ้อย: 1075, ข้าว: 11300, ข้าวโพด: 8550, มันสำปะหลัง: 2770 },
  { month: 'ส.ค.', อ้อย: 1080, ข้าว: 11400, ข้าวโพด: 8500, มันสำปะหลัง: 2780 },
  { month: 'ก.ย.', อ้อย: 1085, ข้าว: 11350, ข้าวโพด: 8480, มันสำปะหลัง: 2760 },
  { month: 'ต.ค.', อ้อย: 1090, ข้าว: 11400, ข้าวโพด: 8520, มันสำปะหลัง: 2770 },
  { month: 'พ.ย.', อ้อย: 1085, ข้าว: 11200, ข้าวโพด: 8500, มันสำปะหลัง: 2750 },
  { month: 'ธ.ค.', อ้อย: 1080, ข้าว: 11200, ข้าวโพด: 8500, มันสำปะหลัง: 2750 },
];

const PRODUCTION_DATA = [
  { year: '2562', อ้อย: 74, ข้าว: 30, ข้าวโพด: 5, มันสำปะหลัง: 31 },
  { year: '2563', อ้อย: 75, ข้าว: 29, ข้าวโพด: 4.8, มันสำปะหลัง: 30 },
  { year: '2564', อ้อย: 66, ข้าว: 31, ข้าวโพด: 5.2, มันสำปะหลัง: 32 },
  { year: '2565', อ้อย: 92, ข้าว: 33, ข้าวโพด: 5.5, มันสำปะหลัง: 34 },
  { year: '2566', อ้อย: 93, ข้าว: 32, ข้าวโพด: 5.3, มันสำปะหลัง: 33 },
  { year: '2567', อ้อย: 95, ข้าว: 33, ข้าวโพด: 5.4, มันสำปะหลัง: 34 },
];

const CROP_COLORS = {
  อ้อย: '#2D8A5F',
  ข้าว: '#D4A017',
  ข้าวโพด: '#E07B39',
  มันสำปะหลัง: '#8B5E3C',
};

const MARKET_INSIGHTS = [
  {
    crop: 'อ้อย',
    emoji: '🌿',
    trend: 'up',
    change: '+2.8%',
    price: '1,080 บาท/ตัน',
    color: '#2D8A5F',
    insight: 'ราคาอ้อยมีแนวโน้มเพิ่มขึ้นต่อเนื่อง ตามความต้องการน้ำตาลในตลาดโลก และนโยบายสนับสนุนของรัฐ',
    outlook: 'เป็นบวก',
  },
  {
    crop: 'ข้าว',
    emoji: '🌾',
    trend: 'up',
    change: '+6.7%',
    price: '11,200 บาท/ตัน',
    color: '#D4A017',
    insight: 'ราคาข้าวสูงขึ้นจากความต้องการส่งออก แต่มีความผันผวนสูงตามสภาพอากาศ',
    outlook: 'ปานกลาง',
  },
  {
    crop: 'ข้าวโพด',
    emoji: '🌽',
    trend: 'down',
    change: '-3.4%',
    price: '8,500 บาท/ตัน',
    color: '#E07B39',
    insight: 'ราคาข้าวโพดลดลงเล็กน้อยจากการนำเข้าที่เพิ่มขึ้น แต่ยังมีความต้องการจากอุตสาหกรรมอาหารสัตว์',
    outlook: 'ระวัง',
  },
  {
    crop: 'มันสำปะหลัง',
    emoji: '🥔',
    trend: 'stable',
    change: '-1.8%',
    price: '2,750 บาท/ตัน',
    color: '#8B5E3C',
    insight: 'ราคามันสำปะหลังค่อนข้างทรงตัว ตลาดส่งออกแป้งมันยังแข็งแกร่ง โดยเฉพาะตลาดจีน',
    outlook: 'ทรงตัว',
  },
];

export default function Trends() {
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['อ้อย', 'ข้าว', 'ข้าวโพด', 'มันสำปะหลัง']);

  const toggleCrop = (name: string) => {
    setSelectedCrops(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-[oklch(0.22_0.06_155)] py-10">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
              แนวโน้มราคาและตลาด
            </h1>
            <p className="text-white/60">ติดตามราคาพืชผลและวิเคราะห์แนวโน้มตลาด</p>
          </motion.div>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Market Insights Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKET_INSIGHTS.map((item, i) => (
            <motion.div
              key={item.crop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-4 card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-bold" style={{ color: item.color, fontFamily: 'Prompt, sans-serif' }}>
                    {item.crop}
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  item.trend === 'up' ? 'bg-green-100 text-green-700' :
                  item.trend === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                   item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                   <Minus className="w-3 h-3" />}
                  {item.change}
                </div>
              </div>
              <div className="text-lg font-bold text-foreground mb-1" style={{ fontFamily: 'Prompt, sans-serif' }}>
                {item.price}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.insight}</p>
              <Badge
                variant="secondary"
                className="text-xs"
                style={{ color: item.color, backgroundColor: item.color + '15' }}
              >
                แนวโน้ม: {item.outlook}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Crop filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">แสดงกราฟ:</span>
          {Object.keys(CROP_COLORS).map(name => (
            <button
              key={name}
              onClick={() => toggleCrop(name)}
              className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-all ${
                selectedCrops.includes(name) ? 'text-white' : 'bg-white text-muted-foreground border-border'
              }`}
              style={selectedCrops.includes(name) ? {
                backgroundColor: CROP_COLORS[name as keyof typeof CROP_COLORS],
                borderColor: CROP_COLORS[name as keyof typeof CROP_COLORS],
              } : { borderColor: CROP_COLORS[name as keyof typeof CROP_COLORS] + '60' }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="yearly" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="yearly">ราคารายปี</TabsTrigger>
            <TabsTrigger value="monthly">ราคารายเดือน</TabsTrigger>
            <TabsTrigger value="production">ผลผลิต</TabsTrigger>
          </TabsList>

          <TabsContent value="yearly">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Prompt, sans-serif' }}>ราคาพืชผล 2562-2568 (บาท/ตัน)</CardTitle>
                <CardDescription>ข้อมูลราคาเฉลี่ยรายปี ปี 2568 เป็นค่าประมาณการ</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={PRICE_HISTORY} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => v.toLocaleString() + ' บาท/ตัน'} />
                    <Legend />
                    <ReferenceLine x="2568 (คาด)" stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'ประมาณการ', fontSize: 10 }} />
                    {selectedCrops.map(name => (
                      <Line
                        key={name}
                        type="monotone"
                        dataKey={name}
                        stroke={CROP_COLORS[name as keyof typeof CROP_COLORS]}
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Prompt, sans-serif' }}>ราคาพืชผลรายเดือน ปี 2567 (บาท/ตัน)</CardTitle>
                <CardDescription>ราคาเฉลี่ยรายเดือนตลอดปี 2567</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <AreaChart data={MONTHLY_PRICE_2567} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => v.toLocaleString() + ' บาท/ตัน'} />
                    <Legend />
                    {selectedCrops.map(name => (
                      <Area
                        key={name}
                        type="monotone"
                        dataKey={name}
                        stroke={CROP_COLORS[name as keyof typeof CROP_COLORS]}
                        fill={CROP_COLORS[name as keyof typeof CROP_COLORS]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Prompt, sans-serif' }}>ปริมาณผลผลิตรวมทั้งประเทศ (ล้านตัน)</CardTitle>
                <CardDescription>ปริมาณผลผลิตพืชหลักของไทย 2562-2567</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={PRODUCTION_DATA} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => v.toFixed(1) + ' ล้านตัน'} />
                    <Legend />
                    {selectedCrops.map(name => (
                      <Bar
                        key={name}
                        dataKey={name}
                        fill={CROP_COLORS[name as keyof typeof CROP_COLORS]}
                        radius={[3, 3, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-xl border border-border text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            ข้อมูลราคาและผลผลิตในหน้านี้เป็นข้อมูลอ้างอิงโดยประมาณ จากแหล่งข้อมูลสาธารณะของกรมส่งเสริมการเกษตร
            สมาคมชาวไร่อ้อย และสำนักงานเศรษฐกิจการเกษตร ราคาจริงอาจแตกต่างตามพื้นที่และช่วงเวลา
            กรุณาตรวจสอบราคาล่าสุดจากโรงงานหรือพ่อค้าคนกลางในพื้นที่ของท่านก่อนตัดสินใจ
          </p>
        </div>
      </div>

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

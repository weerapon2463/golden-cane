// Calculator.tsx — ROI calculator page
// Design: Modern Agri-Tech Dashboard

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { Calculator, TrendingUp, DollarSign, Leaf, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCrops } from '@/contexts/CropContext';
import { toast } from 'sonner';

const SUGARCANE_DEFAULTS = {
  landArea: 10,
  yieldPerRai: 10,
  pricePerTon: 1050,
  seedCost: 800,
  fertilizerCost: 1200,
  pesticideCost: 300,
  laborCost: 1500,
  harvestCost: 800,
  otherCost: 400,
  ratoonsYears: 3,
  ratoonYieldMultiplier: 0.85,
};

export default function CalculatorPage() {
  const { allCrops } = useCrops();
  const [form, setForm] = useState(SUGARCANE_DEFAULTS);
  const [selectedCropId, setSelectedCropId] = useState('sugarcane');

  const update = (key: string, val: number) => setForm(prev => ({ ...prev, [key]: val }));

  const totalCostPerRai = form.seedCost + form.fertilizerCost + form.pesticideCost +
    form.laborCost + form.harvestCost + form.otherCost;
  const revenuePerRai = form.yieldPerRai * form.pricePerTon;
  const profitPerRai = revenuePerRai - totalCostPerRai;
  const roi = totalCostPerRai > 0 ? (profitPerRai / totalCostPerRai) * 100 : 0;

  const totalRevenue = revenuePerRai * form.landArea;
  const totalCost = totalCostPerRai * form.landArea;
  const totalProfit = profitPerRai * form.landArea;

  // Multi-year projection (ratoon)
  const yearlyData = useMemo(() => {
    return Array.from({ length: form.ratoonsYears + 1 }, (_, i) => {
      const yieldMult = i === 0 ? 1 : Math.pow(form.ratoonYieldMultiplier, i);
      const rev = form.yieldPerRai * yieldMult * form.pricePerTon * form.landArea;
      const cost = i === 0 ? totalCost : totalCost * 0.7; // เก็บตอ ต้นทุนลดลง
      const profit = rev - cost;
      return {
        year: `ปีที่ ${i + 1}${i === 0 ? ' (ปลูกใหม่)' : ` (เก็บตอ ${i})`}`,
        รายได้: Math.round(rev),
        ต้นทุน: Math.round(cost),
        กำไร: Math.round(profit),
      };
    });
  }, [form, totalCost]);

  const costBreakdown = [
    { name: 'ค่าพันธุ์', value: form.seedCost * form.landArea, color: '#2D8A5F' },
    { name: 'ค่าปุ๋ย', value: form.fertilizerCost * form.landArea, color: '#D4A017' },
    { name: 'ค่ายา', value: form.pesticideCost * form.landArea, color: '#E07B39' },
    { name: 'ค่าแรง', value: form.laborCost * form.landArea, color: '#8B5E3C' },
    { name: 'ค่าเก็บเกี่ยว', value: form.harvestCost * form.landArea, color: '#7C5CBF' },
    { name: 'อื่นๆ', value: form.otherCost * form.landArea, color: '#64748B' },
  ];

  const loadCropData = (cropId: string) => {
    const crop = allCrops.find(c => c.id === cropId);
    if (!crop) return;
    setSelectedCropId(cropId);
    setForm(prev => ({
      ...prev,
      yieldPerRai: crop.yieldPerRai,
      pricePerTon: crop.pricePerTon,
      seedCost: crop.seedCost,
      fertilizerCost: crop.fertilizerCost,
      pesticideCost: crop.pesticideCost,
      laborCost: crop.laborCost,
      harvestCost: crop.harvestCost,
      otherCost: crop.otherCost,
    }));
    toast.success(`โหลดข้อมูล ${crop.name} แล้ว`);
  };

  const reset = () => {
    setForm(SUGARCANE_DEFAULTS);
    setSelectedCropId('sugarcane');
    toast.info('รีเซ็ตค่าเริ่มต้นแล้ว');
  };

  const InputField = ({ label, field, min = 0, step = 100, unit = 'บาท' }: {
    label: string; field: keyof typeof form; min?: number; step?: number; unit?: string;
  }) => (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        <Input
          type="number"
          value={form[field]}
          onChange={e => update(field, parseFloat(e.target.value) || 0)}
          min={min}
          step={step}
          className="text-sm"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-[oklch(0.22_0.06_155)] py-10">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
              คำนวณผลตอบแทน
            </h1>
            <p className="text-white/60">ใส่ข้อมูลพื้นที่และต้นทุนของคุณ เพื่อดูกำไรที่คาดหวัง</p>
          </motion.div>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick load from crop data */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'Prompt, sans-serif' }}>
            โหลดข้อมูลจากพืชในระบบ
          </p>
          <div className="flex flex-wrap gap-2">
            {allCrops.map(crop => (
              <button
                key={crop.id}
                onClick={() => loadCropData(crop.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                  selectedCropId === crop.id
                    ? 'text-white shadow-md'
                    : 'bg-white text-muted-foreground border-border hover:border-primary/40'
                }`}
                style={selectedCropId === crop.id ? {
                  backgroundColor: crop.colorHex,
                  borderColor: crop.colorHex,
                } : { borderColor: crop.colorHex + '60' }}
              >
                {crop.emoji} {crop.name}
              </button>
            ))}
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border-2 border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              รีเซ็ต
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Land area */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  <Leaf className="w-4 h-4 text-primary" />
                  ขนาดพื้นที่
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>จำนวนไร่</Label>
                    <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Prompt, sans-serif' }}>
                      {form.landArea} ไร่
                    </span>
                  </div>
                  <Slider
                    value={[form.landArea]}
                    onValueChange={([v]) => update('landArea', v)}
                    min={1} max={200} step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 ไร่</span>
                    <span>200 ไร่</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Production */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  <TrendingUp className="w-4 h-4 text-primary" />
                  ผลผลิตและราคา
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InputField label="ผลผลิตต่อไร่" field="yieldPerRai" min={0} step={0.5} unit="ตัน/ไร่" />
                <InputField label="ราคาขาย" field="pricePerTon" min={0} step={50} unit="บาท/ตัน" />
              </CardContent>
            </Card>

            {/* Costs */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  <DollarSign className="w-4 h-4 text-primary" />
                  ต้นทุนต่อไร่
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InputField label="ค่าพันธุ์/เมล็ด" field="seedCost" />
                <InputField label="ค่าปุ๋ย" field="fertilizerCost" />
                <InputField label="ค่ายาและสารเคมี" field="pesticideCost" />
                <InputField label="ค่าแรงงาน" field="laborCost" />
                <InputField label="ค่าเก็บเกี่ยว" field="harvestCost" />
                <InputField label="ค่าใช้จ่ายอื่นๆ" field="otherCost" />
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>รวมต้นทุน/ไร่</span>
                  <span className="text-foreground">{totalCostPerRai.toLocaleString()} บาท</span>
                </div>
                <div className="bg-muted/30 rounded-lg p-2 text-xs text-foreground leading-relaxed">
                  <p className="font-semibold mb-1">หมายเหตุ เก็บตอ:</p>
                  <p>ต้นทุนของเก็บตอ ต่อไปลดลง 30-40% เทียบกับปลูกใหม่ เพราะไม่ต้องกับค่าพันธุ์แลงความหวานแลงการเก็บเกี่ยว</p>
                </div>
              </CardContent>
            </Card>

            {/* Ratoon settings */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  การคาดการณ์หลายปี (เก็บตอ)
                </CardTitle>
                <CardDescription className="text-xs">สำหรับอ้อยที่ปลูกครั้งเดียวเก็บหลายรอบ ต้นทุนหลังครั้งลดลง 30-40%</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-xs">จำนวนปีที่คาดการณ์</Label>
                    <span className="text-sm font-bold text-primary">{form.ratoonsYears + 1} ปี</span>
                  </div>
                  <Slider
                    value={[form.ratoonsYears]}
                    onValueChange={([v]) => update('ratoonsYears', v)}
                    min={0} max={5} step={1}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-xs">ผลผลิตเก็บตอ (% ของปีแรก)</Label>
                    <span className="text-sm font-bold text-primary">{Math.round(form.ratoonYieldMultiplier * 100)}%</span>
                  </div>
                  <Slider
                    value={[form.ratoonYieldMultiplier * 100]}
                    onValueChange={([v]) => update('ratoonYieldMultiplier', v / 100)}
                    min={50} max={100} step={5}
                  />
                  <p className="text-xs text-muted-foreground mt-2">ที่ตัดต้นทุนหลังครั้งจะลดลงเรื่อยไป ปกติ 3-4 ครั้งต่อไหม่ปลูกใหม่</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'รายได้รวม', value: totalRevenue, color: '#2D8A5F', prefix: '฿' },
                { label: 'ต้นทุนรวม', value: totalCost, color: '#E07B39', prefix: '฿' },
                { label: 'กำไรสุทธิ', value: totalProfit, color: totalProfit >= 0 ? '#2D8A5F' : '#DC2626', prefix: totalProfit >= 0 ? '+฿' : '฿' },
                { label: 'ROI', value: roi, color: roi >= 0 ? '#D4A017' : '#DC2626', suffix: '%', isROI: true },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-4 text-center"
                >
                  <div className="text-xl font-bold" style={{ color: stat.color, fontFamily: 'Prompt, sans-serif' }}>
                    {stat.prefix}{stat.isROI ? roi.toFixed(1) : Math.abs(stat.value).toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  {!stat.isROI && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      ({(stat.value / form.landArea).toLocaleString()} บาท/ไร่)
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <Tabs defaultValue="yearly" className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="yearly">คาดการณ์รายปี</TabsTrigger>
                <TabsTrigger value="cost">สัดส่วนต้นทุน</TabsTrigger>
                <TabsTrigger value="breakeven">จุดคุ้มทุน</TabsTrigger>
              </TabsList>

              <TabsContent value="yearly">
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base" style={{ fontFamily: 'Prompt, sans-serif' }}>
                      ผลตอบแทนคาดการณ์รายปี ({form.landArea} ไร่)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => v.toLocaleString() + ' บาท'} />
                        <Legend />
                        <Bar dataKey="รายได้" fill="#2D8A5F" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="ต้นทุน" fill="#E07B39" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="กำไร" fill="#D4A017" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    {/* Cumulative profit */}
                    <div className="mt-4 p-3 bg-primary/5 rounded-xl">
                      <p className="text-sm font-semibold text-primary mb-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
                        กำไรสะสม {form.ratoonsYears + 1} ปี
                      </p>
                      <p className="text-2xl font-bold text-primary" style={{ fontFamily: 'Prompt, sans-serif' }}>
                        ฿{yearlyData.reduce((sum, d) => sum + d.กำไร, 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        เฉลี่ย ฿{Math.round(yearlyData.reduce((sum, d) => sum + d.กำไร, 0) / (form.ratoonsYears + 1)).toLocaleString()} บาท/ปี
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cost">
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base" style={{ fontFamily: 'Prompt, sans-serif' }}>
                      สัดส่วนต้นทุนทั้งหมด ({form.landArea} ไร่)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={costBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          innerRadius={50}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {costBreakdown.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => v.toLocaleString() + ' บาท'} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {costBreakdown.map(c => (
                        <div key={c.name} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                            <span>{c.name}</span>
                          </div>
                          <span className="font-semibold">{c.value.toLocaleString()} ฿</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breakeven">
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base" style={{ fontFamily: 'Prompt, sans-serif' }}>
                      การวิเคราะห์จุดคุ้มทุน
                    </CardTitle>
                    <CardDescription className="text-xs">แสดงรายได้และต้นทุนตามจำนวนไร่</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const breakevenData = Array.from({ length: 21 }, (_, i) => {
                        const area = i * 5 + 5;
                        return {
                          ไร่: area,
                          รายได้: revenuePerRai * area,
                          ต้นทุน: totalCostPerRai * area,
                        };
                      });
                      const breakevenArea = totalCostPerRai > 0 && revenuePerRai > totalCostPerRai
                        ? (totalCostPerRai / (revenuePerRai - totalCostPerRai)).toFixed(1)
                        : null;
                      return (
                        <>
                          {breakevenArea && (
                            <div className="mb-3 p-3 bg-accent/10 border border-accent/30 rounded-xl text-sm">
                              <span className="font-semibold text-accent-foreground">จุดคุ้มทุน: </span>
                              <span className="font-bold text-primary">{breakevenArea} ไร่</span>
                              <span className="text-muted-foreground ml-2">
                                (ต้องการรายได้ {(parseFloat(breakevenArea) * revenuePerRai).toLocaleString()} บาท)
                              </span>
                            </div>
                          )}
                          <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={breakevenData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="ไร่" tick={{ fontSize: 11 }} label={{ value: 'ไร่', position: 'insideBottom', offset: -3, fontSize: 11 }} />
                              <YAxis tick={{ fontSize: 11 }} />
                              <Tooltip formatter={(v: number) => v.toLocaleString() + ' บาท'} />
                              <Legend />
                              <Line type="monotone" dataKey="รายได้" stroke="#2D8A5F" strokeWidth={2.5} dot={false} />
                              <Line type="monotone" dataKey="ต้นทุน" stroke="#E07B39" strokeWidth={2.5} dot={false} strokeDasharray="5 5" />
                            </LineChart>
                          </ResponsiveContainer>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Comparison with other crops */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  เปรียบเทียบกับพืชอื่น ({form.landArea} ไร่)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allCrops.filter(c => c.isDefault).map(crop => {
                    const cropRevenue = crop.revenuePerRai * form.landArea;
                    const cropCost = crop.totalCost * form.landArea;
                    const cropProfit = cropRevenue - cropCost;
                    const isSelected = crop.id === selectedCropId;
                    return (
                      <div
                        key={crop.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
                        }`}
                      >
                        <span className="text-xl">{crop.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm" style={{ color: crop.colorHex }}>
                              {crop.name}
                            </span>
                            <span className={`text-sm font-bold ${cropProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                              {cropProfit >= 0 ? '+' : ''}฿{cropProfit.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.max(0, (cropProfit / (allCrops.filter(c => c.isDefault).reduce((m, c) => Math.max(m, c.netProfitPerRai * form.landArea), 1))) * 100))}%`,
                                backgroundColor: crop.colorHex,
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          <div>ROI {crop.roi}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
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

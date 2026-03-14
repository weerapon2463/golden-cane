// AddCropDialog.tsx — Dialog for adding custom crops
// Design: Modern Agri-Tech Dashboard

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCrops } from '@/contexts/CropContext';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

interface AddCropDialogProps {
  open: boolean;
  onClose: () => void;
}

const EMOJIS = ['🌱', '🌿', '🍃', '🌾', '🌻', '🥦', '🥕', '🍠', '🌰', '🫘', '🌴', '🎋'];

export default function AddCropDialog({ open, onClose }: AddCropDialogProps) {
  const { addCustomCrop } = useCrops();
  const [form, setForm] = useState({
    name: '',
    emoji: '🌱',
    yieldPerRai: 1,
    pricePerTon: 5000,
    seedCost: 500,
    fertilizerCost: 1000,
    pesticideCost: 300,
    laborCost: 1200,
    harvestCost: 600,
    otherCost: 300,
    growthMonths: 6,
    difficulty: 3,
    marketDemand: 3,
    droughtResistance: 3,
    floodResistance: 3,
    description: '',
    waterRequirement: 'ปานกลาง',
    soilType: 'ดินร่วน',
  });

  const totalCost = form.seedCost + form.fertilizerCost + form.pesticideCost +
    form.laborCost + form.harvestCost + form.otherCost;
  const revenue = form.yieldPerRai * form.pricePerTon;
  const profit = revenue - totalCost;
  const roi = totalCost > 0 ? Math.round((profit / totalCost) * 100) : 0;

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error('กรุณาระบุชื่อพืช');
      return;
    }
    addCustomCrop({ ...form, id: `custom_${nanoid(6)}` });
    toast.success(`เพิ่ม "${form.name}" สำเร็จ!`);
    onClose();
    setForm({ ...form, name: '', emoji: '🌱', description: '' });
  };

  const update = (key: string, val: string | number) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Prompt, sans-serif' }}>เพิ่มพืชใหม่</DialogTitle>
          <DialogDescription>กรอกข้อมูลพืชที่ต้องการเปรียบเทียบ</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* ชื่อและ emoji */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>ไอคอน</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => update('emoji', e)}
                    className={`w-9 h-9 text-xl rounded-lg border-2 transition-all ${
                      form.emoji === e ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="crop-name">ชื่อพืช *</Label>
              <Input
                id="crop-name"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="เช่น ยางพารา, ปาล์มน้ำมัน"
                className="mt-1.5"
              />
              <div className="mt-2">
                <Label htmlFor="crop-desc">คำอธิบาย</Label>
                <Input
                  id="crop-desc"
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="อธิบายสั้นๆ เกี่ยวกับพืชนี้"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          {/* ผลผลิตและราคา */}
          <div className="bg-muted/50 rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-3" style={{ fontFamily: 'Prompt, sans-serif' }}>
              ผลผลิตและราคา
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ผลผลิต (ตัน/ไร่)</Label>
                <Input
                  type="number"
                  value={form.yieldPerRai}
                  onChange={e => update('yieldPerRai', parseFloat(e.target.value) || 0)}
                  min={0} step={0.1}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>ราคาขาย (บาท/ตัน)</Label>
                <Input
                  type="number"
                  value={form.pricePerTon}
                  onChange={e => update('pricePerTon', parseFloat(e.target.value) || 0)}
                  min={0} step={100}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>ระยะเวลาปลูก (เดือน)</Label>
                <Input
                  type="number"
                  value={form.growthMonths}
                  onChange={e => update('growthMonths', parseInt(e.target.value) || 1)}
                  min={1} max={36}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>ความต้องการน้ำ</Label>
                <Input
                  value={form.waterRequirement}
                  onChange={e => update('waterRequirement', e.target.value)}
                  placeholder="เช่น ต่ำ / ปานกลาง / สูง"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          {/* ต้นทุน */}
          <div className="bg-muted/50 rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-3" style={{ fontFamily: 'Prompt, sans-serif' }}>
              ต้นทุน (บาท/ไร่)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'seedCost', label: 'ค่าพันธุ์/เมล็ด' },
                { key: 'fertilizerCost', label: 'ค่าปุ๋ย' },
                { key: 'pesticideCost', label: 'ค่ายาและสารเคมี' },
                { key: 'laborCost', label: 'ค่าแรงงาน' },
                { key: 'harvestCost', label: 'ค่าเก็บเกี่ยว' },
                { key: 'otherCost', label: 'ค่าใช้จ่ายอื่นๆ' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Input
                    type="number"
                    value={form[key as keyof typeof form] as number}
                    onChange={e => update(key, parseFloat(e.target.value) || 0)}
                    min={0} step={50}
                    className="mt-1.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* คะแนนคุณสมบัติ */}
          <div className="bg-muted/50 rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-3" style={{ fontFamily: 'Prompt, sans-serif' }}>
              คุณสมบัติ (1=ต่ำ, 5=สูง)
            </h4>
            <div className="space-y-3">
              {[
                { key: 'difficulty', label: 'ความยากในการปลูก' },
                { key: 'marketDemand', label: 'ความต้องการตลาด' },
                { key: 'droughtResistance', label: 'ความทนแล้ง' },
                { key: 'floodResistance', label: 'ความทนน้ำท่วม' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <Label className="w-40 text-xs">{label}</Label>
                  <Slider
                    value={[form[key as keyof typeof form] as number]}
                    onValueChange={([v]) => update(key, v)}
                    min={1} max={5} step={1}
                    className="flex-1"
                  />
                  <span className="w-6 text-center font-bold text-primary text-sm">
                    {form[key as keyof typeof form]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* สรุปผล */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-3 text-primary" style={{ fontFamily: 'Prompt, sans-serif' }}>
              สรุปผลตอบแทนโดยประมาณ
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-foreground">{revenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">รายได้/ไร่ (บาท)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{totalCost.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">ต้นทุน/ไร่ (บาท)</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {profit >= 0 ? '+' : ''}{profit.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">กำไร/ไร่ (บาท)</div>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className={`text-sm font-semibold ${roi >= 0 ? 'text-primary' : 'text-destructive'}`}>
                ROI: {roi}%
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
              เพิ่มพืชนี้
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

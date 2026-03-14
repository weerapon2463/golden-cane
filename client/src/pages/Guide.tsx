// Guide.tsx — Sugarcane cultivation guide
// Design: Modern Agri-Tech Dashboard

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Leaf, Droplets, Sun, Sprout, Tractor, DollarSign, Phone, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RATOON_STEP = {
  step: 7,
  icon: Tractor,
  title: 'เก็บตอและปลูกเก็บตอ',
  color: '#16A34A',
  duration: 'หลังเก็บเกี่ยวครั้งแรก',
  content: [
    'หลังเก็บเกี่ยวครั้งแรก ตัดต้นทุนต่ำกว่า 30 ซม. เหลือสุดความหวาน',
    'เก็บตอไว้ 3 ปี ต่อเนื่อง โดยทั่วคำนวณแลงความหวานต้นทุนลดลงในรอบต่อไป',
    'เก็บตอ 1: เก็บเกี่ยวปกติ 10 เดือน หลังเก็บเกี่ยวปกติหลายปี',
    'เก็บตอ 2-3: เก็บเกี่ยวสำหรับกับเก็บตอ 1 ต้นทุนลดลงเพิ่มขึ้น',
    'หลังเก็บเกี่ยวครั้งที่ 4 หรือมากกว่านั้น ต้องปลูกใหม่เพียงผลผลิตจะลดลง',
  ],
  tips: 'ต้นทุนของเก็บตอ ต่อไปลดลง 30-40% เทียบกับปลูกใหม่ แต่ผลผลิตยังคงที่ดี',
};

const GUIDE_STEPS = [
  {
    step: 1,
    icon: Leaf,
    title: 'เตรียมดินและพื้นที่',
    color: '#2D8A5F',
    duration: '2-4 สัปดาห์ก่อนปลูก',
    content: [
      'ไถดินลึก 30-40 ซม. เพื่อให้รากอ้อยเจริญเติบโตได้ดี',
      'ปรับสภาพดิน pH ให้อยู่ระหว่าง 5.5-7.5',
      'ใส่ปูนขาวถ้าดินเป็นกรดมากเกินไป',
      'ยกร่องหรือทำแปลงตามความเหมาะสมของพื้นที่',
      'ตรวจสอบระบบระบายน้ำให้ดี อ้อยไม่ทนน้ำขัง',
    ],
    tips: 'ดินที่เหมาะสมที่สุดคือดินร่วนปนทรายที่ระบายน้ำได้ดี',
  },
  {
    step: 2,
    icon: Sprout,
    title: 'เลือกพันธุ์และปลูก',
    color: '#D4A017',
    duration: 'เดือนที่ 1',
    content: [
      'เลือกพันธุ์ที่เหมาะสมกับพื้นที่ เช่น ขอนแก่น 3, LK 92-11, อู่ทอง 12',
      'ใช้ท่อนพันธุ์ที่สมบูรณ์ ไม่มีโรค ยาว 2-3 ตา',
      'ปลูกในช่วงต้นฤดูฝน (พ.ค.-มิ.ย.) หรือต้นฤดูหนาว (ต.ค.-พ.ย.)',
      'ระยะปลูก 1.2-1.5 เมตร ระหว่างแถว ลึก 15-20 ซม.',
      'คลุมดินหลังปลูกเพื่อรักษาความชื้น',
    ],
    tips: 'พันธุ์ LK 92-11 เป็นที่นิยมมากที่สุด ให้ผลผลิตสูงและทนแล้งได้ดี',
  },
  {
    step: 3,
    icon: Droplets,
    title: 'การให้น้ำและปุ๋ย',
    color: '#3B82F6',
    duration: 'เดือนที่ 1-8',
    content: [
      'ให้น้ำ 7-10 วัน/ครั้ง ในช่วงแรก หลังจากนั้นตามสภาพอากาศ',
      'ใส่ปุ๋ยรองพื้น (สูตร 15-15-15) ตอนปลูก 50 กก./ไร่',
      'ใส่ปุ๋ยแต่งหน้า (สูตร 46-0-0) เมื่ออ้อยอายุ 2-3 เดือน 30-50 กก./ไร่',
      'ใส่ปุ๋ยโพแทสเซียม (สูตร 0-0-60) เมื่ออ้อยอายุ 4-5 เดือน',
      'ลดการให้น้ำในช่วง 2 เดือนก่อนเก็บเกี่ยว เพื่อเพิ่มความหวาน',
    ],
    tips: 'การให้น้ำแบบหยดช่วยประหยัดน้ำได้ 40-50% และเพิ่มผลผลิตได้ 20-30%',
  },
  {
    step: 4,
    icon: Sun,
    title: 'ดูแลและป้องกันโรค',
    color: '#F59E0B',
    duration: 'เดือนที่ 1-10',
    content: [
      'กำจัดวัชพืชในช่วง 3 เดือนแรก เป็นช่วงวิกฤตที่สุด',
      'ตรวจสอบโรคใบขาว (White leaf disease) และโรคเหี่ยว',
      'ป้องกันหนอนกอ โดยใช้สารเคมีหรือชีวภัณฑ์',
      'ตัดใบแก่ออกเพื่อให้อากาศถ่ายเท ลดความชื้นที่เป็นแหล่งโรค',
      'ใช้ยาฆ่าวัชพืชก่อนงอกหลังปลูก เพื่อลดต้นทุนแรงงาน',
    ],
    tips: 'การใช้สารชีวภัณฑ์ Beauveria bassiana ช่วยควบคุมหนอนกอได้ดีโดยไม่มีสารพิษตกค้าง',
  },
  {
    step: 5,
    icon: Tractor,
    title: 'เก็บเกี่ยวและขาย',
    color: '#8B5E3C',
    duration: 'เดือนที่ 11-12',
    content: [
      'เก็บเกี่ยวเมื่ออ้อยอายุ 10-12 เดือน ค่าความหวาน (CCS) สูงสุด',
      'ช่วงเก็บเกี่ยวที่ดีที่สุด พ.ย.-มี.ค. (ฤดูหนาว)',
      'ติดต่อโรงงานน้ำตาลในพื้นที่เพื่อนัดหมายรถตัด',
      'ตัดอ้อยสดดีกว่าเผา เพราะได้ราคาเพิ่ม 30 บาท/ตัน',
      'เก็บตอไว้เพื่อปลูกเก็บตอในปีถัดไป',
    ],
    tips: 'อ้อยสดไม่เผาได้ราคาพิเศษ และลดมลพิษ PM 2.5 ด้วย',
  },
  {
    step: 6,
    icon: DollarSign,
    title: 'การขายและรับเงิน',
    color: '#7C5CBF',
    duration: 'หลังเก็บเกี่ยว',
    content: [
      'โรงงานน้ำตาลจ่ายเงินตามน้ำหนักและค่าความหวาน (CCS)',
      'ราคาอ้อยปี 2567 ประมาณ 1,050-1,100 บาท/ตัน',
      'มีระบบประกันราคาขั้นต่ำจากรัฐบาล',
      'สามารถขอสินเชื่อจากธนาคารเพื่อการเกษตรและสหกรณ์ (ธ.ก.ส.)',
      'เข้าร่วมสมาคมชาวไร่อ้อยเพื่อรับสิทธิประโยชน์เพิ่มเติม',
    ],
    tips: 'เข้าร่วมโครงการ "อ้อยสด ลดการเผา" เพื่อรับเงินสนับสนุนเพิ่มเติมจากรัฐ',
  },
  RATOON_STEP,
];

const CONTACTS = [
  { name: 'กรมส่งเสริมการเกษตร', phone: '02-579-3821', url: 'https://www.doae.go.th' },
  { name: 'สมาคมชาวไร่อ้อยแห่งประเทศไทย', phone: '02-354-1234', url: '#' },
  { name: 'ธนาคารเพื่อการเกษตรและสหกรณ์ (ธ.ก.ส.)', phone: '02-555-0555', url: 'https://www.baac.or.th' },
  { name: 'สำนักงานคณะกรรมการอ้อยและน้ำตาลทราย', phone: '02-202-3555', url: '#' },
];

export default function Guide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-[oklch(0.22_0.06_155)] py-10">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
              คู่มือการปลูกอ้อย
            </h1>
            <p className="text-white/60">ขั้นตอนการปลูกอ้อยตั้งแต่เตรียมดินจนถึงขาย สำหรับเกษตรกรมือใหม่</p>
          </motion.div>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435995365/jNZECRnRB9i5YJLDzEEGai/crop-comparison-bg-oKeZL8tbosQi7xoXiFoRj3.webp"
            alt="พืชหลักของไทย"
            className="w-full h-56 object-cover"
          />
        </div>

        {/* Timeline steps */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Prompt, sans-serif' }}>
            ขั้นตอนการปลูกอ้อย 6 ขั้นตอน
          </h2>
          {GUIDE_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
              >
                <div className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: step.color + '20' }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: step.color }}
                      >
                        ขั้นที่ {step.step}
                      </span>
                      <Badge variant="secondary" className="text-xs">{step.duration}</Badge>
                    </div>
                    <h3 className="font-bold text-foreground mt-1" style={{ fontFamily: 'Prompt, sans-serif' }}>
                      {step.title}
                    </h3>
                  </div>
                  {expandedStep === step.step ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>

                {expandedStep === step.step && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border"
                  >
                    <div className="p-4 space-y-3">
                      <ul className="space-y-2">
                        {step.content.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-foreground">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: step.color }}
                            >
                              {j + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div
                        className="flex items-start gap-2 p-3 rounded-xl text-sm"
                        style={{ backgroundColor: step.color + '10', borderLeft: `3px solid ${step.color}` }}
                      >
                        <span className="text-base">💡</span>
                        <p className="text-foreground">{step.tips}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick facts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'ระยะเวลาปลูก', value: '10-12 เดือน', icon: '📅', color: '#2D8A5F' },
            { label: 'ผลผลิตเฉลี่ย', value: '8-12 ตัน/ไร่', icon: '📦', color: '#D4A017' },
            { label: 'ต้นทุนเฉลี่ย', value: '4,500-5,500 บาท/ไร่', icon: '💰', color: '#E07B39' },
            { label: 'กำไรเฉลี่ย', value: '4,500-6,000 บาท/ไร่', icon: '📈', color: '#7C5CBF' },
          ].map((fact, i) => (
            <Card key={i} className="border-border shadow-sm text-center">
              <CardContent className="pt-5 pb-4">
                <div className="text-3xl mb-2">{fact.icon}</div>
                <div className="font-bold text-lg" style={{ color: fact.color, fontFamily: 'Prompt, sans-serif' }}>
                  {fact.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{fact.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contacts */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Prompt, sans-serif' }}>หน่วยงานที่เกี่ยวข้อง</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {CONTACTS.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                  <div>
                    <p className="font-medium text-sm text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {c.phone}
                    </p>
                  </div>
                  {c.url !== '#' && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

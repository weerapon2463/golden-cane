// Home.tsx — Landing page for อ้อยทอง
// Design: Modern Agri-Tech Dashboard
// Layout: Hero (asymmetric) → Stats → Features → CTA

import { Link } from 'wouter';
import { motion, type Easing } from 'framer-motion';
import { ArrowRight, BarChart3, Calculator, TrendingUp, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCrops } from '@/contexts/CropContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as Easing } }),
};

const FEATURES = [
  {
    icon: BarChart3,
    title: 'เปรียบเทียบพืช 4+ ชนิด',
    desc: 'อ้อย ข้าว ข้าวโพด มันสำปะหลัง และเพิ่มพืชเองได้ไม่จำกัด พร้อมกราฟ 6 รูปแบบ',
    color: '#2D8A5F',
  },
  {
    icon: Calculator,
    title: 'คำนวณผลตอบแทนแม่นยำ',
    desc: 'ใส่ขนาดพื้นที่ ต้นทุน ราคาขาย แล้วดูกำไรสุทธิและ ROI ทันที',
    color: '#D4A017',
  },
  {
    icon: TrendingUp,
    title: 'วิเคราะห์หลายมิติ',
    desc: 'เปรียบเทียบรายได้ ต้นทุน ความเสี่ยง ความทนแห้ง และความต้องการตลาด',
    color: '#E07B39',
  },
];

const ADVANTAGES = [
  'มีโรงงานน้ำตาลรับซื้อแน่นอน ราคาประกัน',
  'ปลูกครั้งเดียว เก็บเกี่ยวได้หลายรอบ (ratoon)',
  'ทนแล้งได้ดี ลดความเสี่ยงจากภัยแล้ง',
  'ROI เฉลี่ย 110% ต่อปี สูงกว่าข้าว 3 เท่า',
  'มีระบบสนับสนุนจากรัฐและสมาคมชาวไร่อ้อย',
  'ต้นทุนต่อไร่ต่ำกว่าพืชอื่นในระยะยาว',
];

export default function Home() {
  const { allCrops } = useCrops();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663435995365/jNZECRnRB9i5YJLDzEEGai/hero-sugarcane-abgjsAiEwf923kw9HEvSWS.webp)` }}
        />
        {/* Gradient overlay — dark left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.06_155/0.92)] via-[oklch(0.12_0.06_155/0.7)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.06_155/0.5)] via-transparent to-transparent" />

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-[oklch(0.72_0.14_75/0.2)] border border-[oklch(0.72_0.14_75/0.4)] rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.14_75)] animate-pulse" />
              <span className="text-[oklch(0.72_0.14_75)] text-sm font-medium">สำหรับเกษตรกรรายใหม่</span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: 'Prompt, sans-serif' }}
            >
              ปลูกอ้อย
              <br />
              <span className="text-[oklch(0.72_0.14_75)]">ทำกำไรได้จริง</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="text-white/80 text-lg mb-8 leading-relaxed"
            >
              เปรียบเทียบผลตอบแทนพืชหลายชนิด คำนวณกำไรจากพื้นที่ของคุณ
              และดูกราฟวิเคราะห์เชิงลึก เพื่อตัดสินใจปลูกได้อย่างมั่นใจ
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-3"
            >
              <Link href="/compare">
                <Button size="lg" className="bg-[oklch(0.72_0.14_75)] hover:bg-[oklch(0.65_0.14_75)] text-[oklch(0.18_0.04_50)] font-semibold gap-2 shadow-lg">
                  เปรียบเทียบพืชเลย
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent gap-2">
                  <Calculator className="w-4 h-4" />
                  คำนวณผลตอบแทน
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-[oklch(0.22_0.06_155)] py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10,500', unit: 'บาท/ไร่', label: 'รายได้อ้อยเฉลี่ย', color: '#2D8A5F' },
              { value: '110%', unit: 'ROI', label: 'ผลตอบแทนต่อปี', color: '#D4A017' },
              { value: '12', unit: 'เดือน', label: 'ระยะเวลาเก็บเกี่ยว', color: '#E07B39' },
              { value: `${allCrops.length}+`, unit: 'ชนิด', label: 'พืชในระบบ', color: '#7C5CBF' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold" style={{ color: stat.color, fontFamily: 'Prompt, sans-serif' }}>
                  {stat.value}
                  <span className="text-lg ml-1 text-white/60">{stat.unit}</span>
                </div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: 'Prompt, sans-serif' }}>
              เครื่องมือช่วยตัดสินใจ
            </h2>
            <div className="section-divider w-24 mx-auto mb-4" />
            <p className="text-muted-foreground max-w-xl mx-auto">
              ข้อมูลครบ วิเคราะห์ได้ลึก ช่วยให้คุณตัดสินใจปลูกพืชได้อย่างมั่นใจ
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card border border-border rounded-2xl p-6 card-hover shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: f.color + '20' }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sugarcane */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 mb-4">
                <span className="text-primary text-sm font-medium">ทำไมต้องอ้อย?</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Prompt, sans-serif' }}>
                อ้อยคือทางเลือกที่ดีที่สุด
                <br />
                <span className="text-primary">สำหรับเกษตรกรรายใหม่</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                ด้วยระบบโรงงานน้ำตาลที่รับซื้อแน่นอน ราคาประกัน และต้นทุนต่ำ
                อ้อยจึงเป็นพืชที่เหมาะสมที่สุดสำหรับผู้เริ่มต้น
              </p>
              <div className="space-y-3">
                {ADVANTAGES.map((adv, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{adv}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/compare">
                  <Button className="bg-primary text-primary-foreground gap-2">
                    ดูการเปรียบเทียบเต็ม
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435995365/jNZECRnRB9i5YJLDzEEGai/calculator-bg-5WR7ePeiWYcNPDeZQQBsMx.webp"
                  alt="เกษตรกรถือต้นอ้อย"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-border">
                <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  ฿5,500
                </div>
                <div className="text-xs text-muted-foreground">กำไรสุทธิ/ไร่/ปี</div>
                <div className="text-xs text-primary font-medium mt-0.5">ROI 110%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Crop overview */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: 'Prompt, sans-serif' }}>
              ภาพรวมพืชในระบบ
            </h2>
            <div className="section-divider w-24 mx-auto mb-4" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allCrops.filter(c => c.isDefault).map((crop, i) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 card-hover"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{crop.emoji}</span>
                  <div>
                    <div className="font-bold text-foreground" style={{ fontFamily: 'Prompt, sans-serif' }}>
                      {crop.name}
                    </div>
                    <div
                      className="text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-0.5"
                      style={{ backgroundColor: crop.colorHex + '20', color: crop.colorHex }}
                    >
                      ROI {crop.roi}%
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">รายได้/ไร่</span>
                    <span className="font-semibold">{crop.revenuePerRai.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">กำไร/ไร่</span>
                    <span className="font-semibold text-primary">{crop.netProfitPerRai.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ระยะเวลา</span>
                    <span className="font-semibold">{crop.growthMonths} เดือน</span>
                  </div>
                </div>
                {/* Mini bar */}
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, crop.roi))}%`,
                      backgroundColor: crop.colorHex,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[oklch(0.22_0.06_155)]">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Prompt, sans-serif' }}>
              พร้อมเริ่มต้นแล้วหรือยัง?
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              ใช้เครื่องมือของเราฟรี ไม่ต้องสมัครสมาชิก เพื่อวางแผนการปลูกที่ดีที่สุด
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/compare">
                <Button size="lg" className="bg-[oklch(0.72_0.14_75)] hover:bg-[oklch(0.65_0.14_75)] text-[oklch(0.18_0.04_50)] font-semibold gap-2">
                  เริ่มเปรียบเทียบพืช
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  คำนวณผลตอบแทน
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[oklch(0.15_0.05_155)] py-8">
        <div className="container">
          <div className="text-center text-white/40 text-sm mb-4">
            <p>© 2026 อ้อยทอง — ที่ปรึกษาเกษตรกรรายใหม่ | ข้อมูลอ้างอิงจากกรมส่งเสริมการเกษตรและสมาคมชาวไร่อ้อย</p>
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

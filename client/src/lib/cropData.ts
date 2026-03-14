// cropData.ts — ข้อมูลพืชสำหรับระบบเปรียบเทียบ
// Design: Modern Agri-Tech Dashboard

export interface CropData {
  id: string;
  name: string;
  emoji: string;
  color: string;          // oklch color string
  colorHex: string;       // hex for chart
  isDefault: boolean;
  isCustom?: boolean;

  // ข้อมูลผลผลิตและราคา
  yieldPerRai: number;    // ตัน/ไร่
  pricePerTon: number;    // บาท/ตัน
  revenuePerRai: number;  // บาท/ไร่ (คำนวณอัตโนมัติ)

  // ต้นทุน (บาท/ไร่)
  seedCost: number;
  fertilizerCost: number;
  pesticideCost: number;
  laborCost: number;
  harvestCost: number;
  otherCost: number;
  totalCost: number;      // คำนวณอัตโนมัติ

  // ผลตอบแทน
  netProfitPerRai: number;  // กำไรสุทธิ/ไร่
  roi: number;              // % ROI

  // ข้อมูลการปลูก
  growthMonths: number;   // ระยะเวลาปลูก (เดือน)
  waterRequirement: string; // ปริมาณน้ำ
  soilType: string;       // ประเภทดิน
  difficulty: number;     // ความยาก 1-5
  marketDemand: number;   // ความต้องการตลาด 1-5
  droughtResistance: number; // ทนแล้ง 1-5
  floodResistance: number;   // ทนน้ำท่วม 1-5

  // ข้อมูลการเก็บเกี่ยวและ ratoon
  harvestsPerYear: number;  // จำนวนรอบเก็บเกี่ยว/ปี
  firstHarvestMonths: number; // ระยะเวลาถึงเก็บเกี่ยวครั้งแรก (เดือน)
  subsequentHarvestMonths: number; // ระยะเวลาเก็บเกี่ยวรอบถัดไป (เดือน)
  canRatoon: boolean;       // สามารถเก็บตอได้หรือไม่
  ratoonYears: number;      // จำนวนปีที่สามารถเก็บตอได้
  ratoonInfo: string;       // ข้อมูลเพิ่มเติมเกี่ยวเก็บตอ

  // ข้อมูลเพิ่มเติม
  description: string;
  advantages: string[];
  disadvantages: string[];
  bestRegions: string[];
  harvestSeason: string;
  harvestSchedule?: string; // ตารางเก็บเกี่ยวรายละเอียด

  // ข้อมูลรายเดือน (12 เดือน) สำหรับกราฟ
  monthlyRevenue: number[];
  monthlyCost: number[];
}

const calcRevenue = (yieldPerRai: number, price: number) => yieldPerRai * price;
const calcTotalCost = (seed: number, fert: number, pest: number, labor: number, harvest: number, other: number) =>
  seed + fert + pest + labor + harvest + other;

export const defaultCrops: CropData[] = [
  {
    id: 'sugarcane',
    name: 'อ้อย',
    emoji: '🌿',
    color: 'oklch(0.45 0.15 155)',
    colorHex: '#2D8A5F',
    isDefault: true,
    yieldPerRai: 10,
    pricePerTon: 1050,
    revenuePerRai: 10500,
    seedCost: 800,
    fertilizerCost: 1200,
    pesticideCost: 300,
    laborCost: 1500,
    harvestCost: 800,
    otherCost: 400,
    totalCost: 5000,
    netProfitPerRai: 5500,
    roi: 110,
    growthMonths: 12,
    waterRequirement: 'ปานกลาง (1,200-1,500 มม./ปี)',
    soilType: 'ดินร่วน ดินร่วนปนทราย',
    difficulty: 2,
    marketDemand: 5,
    droughtResistance: 4,
    floodResistance: 2,
    harvestsPerYear: 1,
    firstHarvestMonths: 12,
    subsequentHarvestMonths: 10,
    canRatoon: true,
    ratoonYears: 3,
    ratoonInfo: 'ปลูกครั้งแรก 12 เดือน หลังเก็บเกี่ยว หลังเก็บตอไว้ หลังเก็บตอ 1 (10 เดือน) หลังเก็บตอ 2 (10 เดือน) หลังเก็บตอ 3 (10 เดือน) หลังปลูกใหม่ (ต้นทุนต่อไร่ 30%)',
    description: 'อ้อยเป็นพืชเศรษฐกิจที่มีตลาดรับซื้อแน่นอนจากโรงงานน้ำตาล มีสัญญาประกันราคา เหมาะสำหรับเกษตรกรที่ต้องการรายได้มั่นคง',
    advantages: [
      'มีโรงงานรับซื้อแน่นอน ราคาประกัน',
      'ปลูกครั้งเดียวเก็บเกี่ยวได้หลายปี (เก็บตอ)',
      'ทนแล้งได้ดี (ยิ่งยิ่ง = ทนได้ดี) ไม่ต้องการน้ำมาก เหมาะสำหรับพื้นที่ในภาคแล้ง',
      'ต้นทุนต่อไร่ต่ำกว่าพืชอื่น',
      'มีระบบสนับสนุนจากรัฐ',
    ],
    disadvantages: [
      'ใช้เวลาปลูกนาน 12 เดือน',
      'ราคาขึ้นลงตามนโยบายรัฐ',
      'ต้องการแรงงานช่วงเก็บเกี่ยว',
    ],
    bestRegions: ['ภาคกลาง', 'ภาคตะวันออกเฉียงเหนือ', 'ภาคเหนือตอนล่าง'],
    harvestSeason: 'พ.ย. - มี.ค.',
    harvestSchedule: 'ปี 1: พ.ย. 2567 - มี.ค. 2568 | Ratoon 1: พ.ย. 2568 - มี.ค. 2569 | Ratoon 2: พ.ย. 2569 - มี.ค. 2570 | Ratoon 3: พ.ย. 2570 - มี.ค. 2571',
    monthlyRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10500],
    monthlyCost: [800, 400, 300, 300, 500, 400, 400, 300, 300, 400, 500, 400],
  },
  {
    id: 'rice',
    name: 'ข้าว',
    emoji: '🌾',
    color: 'oklch(0.65 0.15 85)',
    colorHex: '#D4A017',
    isDefault: true,
    yieldPerRai: 0.5,
    pricePerTon: 10000,
    revenuePerRai: 5000,
    seedCost: 400,
    fertilizerCost: 900,
    pesticideCost: 400,
    laborCost: 1200,
    harvestCost: 600,
    otherCost: 300,
    totalCost: 3800,
    netProfitPerRai: 1200,
    roi: 32,
    growthMonths: 4,
    waterRequirement: 'สูง (1,500+ มม./ปี)',
    soilType: 'ดินเหนียว ดินนา',
    difficulty: 3,
    marketDemand: 4,
    droughtResistance: 1,
    floodResistance: 4,
    harvestsPerYear: 2,
    firstHarvestMonths: 4,
    subsequentHarvestMonths: 4,
    canRatoon: false,
    ratoonYears: 0,
    ratoonInfo: 'ข้าวไม่เก็บตอ ต้องปลูกใหม่ทุกครั้ง แต่สามารถปลูกได้ 2-3 รอบต่อปี ในพื้นที่ชลประทาน',
    description: 'ข้าวเป็นพืชอาหารหลักที่เกษตรกรไทยปลูกมาช้านาน มีตลาดรับซื้อทั้งในและต่างประเทศ แต่ราคาผันผวนและต้องการน้ำมาก',
    advantages: [
      'เป็นพืชคุ้นเคย มีองค์ความรู้สูง',
      'ปลูกได้ 2-3 ครั้ง/ปี ในพื้นที่ชลประทาน',
      'ตลาดกว้าง ทั้งในและต่างประเทศ',
      'ทนน้ำท่วมได้ดี',
    ],
    disadvantages: [
      'ต้องการน้ำมาก',
      'ราคาผันผวนสูง',
      'กำไรต่อไร่ต่ำ',
      'แมลงศัตรูพืชมาก',
    ],
    bestRegions: ['ภาคกลาง', 'ภาคเหนือ', 'ภาคตะวันออกเฉียงเหนือ'],
    harvestSeason: 'ต.ค. - ธ.ค. (นาปี), มี.ค. - พ.ค. (นาปรัง)',
    harvestSchedule: 'นาปี: พ.ค. - ต.ค. | นาปรัง: ต.ค. - มี.ค. | นาปรัง 2: มี.ค. - พ.ค. (ในพื้นที่ชลประทาน)',
    monthlyRevenue: [0, 0, 0, 5000, 0, 0, 0, 0, 0, 0, 0, 0],
    monthlyCost: [400, 600, 800, 600, 400, 400, 400, 600, 800, 600, 400, 400],
  },
  {
    id: 'corn',
    name: 'ข้าวโพด',
    emoji: '🌽',
    color: 'oklch(0.68 0.18 55)',
    colorHex: '#E07B39',
    isDefault: true,
    yieldPerRai: 0.8,
    pricePerTon: 8500,
    revenuePerRai: 6800,
    seedCost: 600,
    fertilizerCost: 1100,
    pesticideCost: 350,
    laborCost: 1000,
    harvestCost: 500,
    otherCost: 250,
    totalCost: 3800,
    netProfitPerRai: 3000,
    roi: 79,
    growthMonths: 4,
    waterRequirement: 'ปานกลาง (600-900 มม./ปี)',
    soilType: 'ดินร่วน ดินร่วนปนทราย',
    difficulty: 2,
    marketDemand: 4,
    droughtResistance: 3,
    floodResistance: 2,
    harvestsPerYear: 2,
    firstHarvestMonths: 4,
    subsequentHarvestMonths: 4,
    canRatoon: false,
    ratoonYears: 0,
    ratoonInfo: 'ข้าวโพดไม่เก็บตอ ต้องปลูกใหม่ทุกครั้ง แต่สามารถปลูกได้ 2-3 รอบต่อปี ในพื้นที่ที่มีน้ำเพียงพอ',
    description: 'ข้าวโพดเลี้ยงสัตว์มีความต้องการสูงจากอุตสาหกรรมอาหารสัตว์ ปลูกได้เร็ว 4 เดือน เหมาะกับพื้นที่ไร่',
    advantages: [
      'ปลูกได้เร็ว 4 เดือน',
      'ความต้องการตลาดสูงจากอุตสาหกรรมอาหารสัตว์',
      'ปลูกได้หลายรอบต่อปี',
      'ดูแลง่าย',
    ],
    disadvantages: [
      'ราคาผันผวนตามราคาโลก',
      'ดินเสื่อมเร็วถ้าปลูกต่อเนื่อง',
      'ต้องการปุ๋ยมาก',
    ],
    bestRegions: ['ภาคเหนือ', 'ภาคตะวันออกเฉียงเหนือ', 'ภาคกลาง'],
    harvestSeason: 'ก.ค. - ส.ค. (ฤดูฝน), ม.ค. - ก.พ. (ฤดูแล้ง)',
    harvestSchedule: 'รอบ 1: พ.ค. - ส.ค. | รอบ 2: ส.ค. - ธ.ค. | รอบ 3: ม.ค. - เม.ย. (ในพื้นที่ที่มีน้ำเพียงพอ)',
    monthlyRevenue: [0, 0, 0, 6800, 0, 0, 0, 0, 0, 0, 0, 0],
    monthlyCost: [600, 700, 900, 700, 600, 600, 600, 700, 900, 700, 600, 600],
  },
  {
    id: 'cassava',
    name: 'มันสำปะหลัง',
    emoji: '🥔',
    color: 'oklch(0.55 0.12 40)',
    colorHex: '#8B5E3C',
    isDefault: true,
    yieldPerRai: 3.5,
    pricePerTon: 2800,
    revenuePerRai: 9800,
    seedCost: 500,
    fertilizerCost: 800,
    pesticideCost: 200,
    laborCost: 1200,
    harvestCost: 700,
    otherCost: 300,
    totalCost: 3700,
    netProfitPerRai: 6100,
    roi: 165,
    growthMonths: 12,
    waterRequirement: 'ต่ำ (600-1,200 มม./ปี)',
    soilType: 'ดินร่วนปนทราย ดินทราย',
    difficulty: 1,
    marketDemand: 4,
    droughtResistance: 5,
    floodResistance: 1,
    harvestsPerYear: 1,
    firstHarvestMonths: 12,
    subsequentHarvestMonths: 0,
    canRatoon: false,
    ratoonYears: 0,
    ratoonInfo: 'มันสำปะหลังไม่เก็บตอ ต้องปลูกใหม่ทุกครั้ง ปลูกได้เพียง 1 ครั้งต่อปี',
    description: 'มันสำปะหลังเป็นพืชที่ทนแล้งได้ดีที่สุด ต้นทุนต่ำ ดูแลง่าย เหมาะกับพื้นที่ดินทรายหรือพื้นที่ขาดแคลนน้ำ',
    advantages: [
      'ทนแล้งได้ดีมาก',
      'ต้นทุนต่ำ ดูแลง่าย',
      'ปลูกได้ในดินที่ไม่อุดมสมบูรณ์',
      'ตลาดส่งออกแป้งมันแข็งแกร่ง',
      'ROI สูงที่สุดในบรรดาพืชหลัก',
    ],
    disadvantages: [
      'ราคาผันผวนมาก',
      'ใช้เวลาปลูกนาน 12 เดือน',
      'ทำให้ดินเสื่อมสภาพเร็ว',
      'ไม่ทนน้ำท่วม',
    ],
    bestRegions: ['ภาคตะวันออกเฉียงเหนือ', 'ภาคตะวันออก', 'ภาคกลาง'],
    harvestSeason: 'ต.ค. - ธ.ค.',
    harvestSchedule: 'ปลูก: มี.ค. - เม.ย. | เก็บเกี่ยว: ต.ค. - ธ.ค. ปีถัดไป',
    monthlyRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9800],
    monthlyCost: [500, 300, 300, 300, 300, 300, 300, 300, 300, 400, 500, 400],
  },
];

export const CROP_COLORS: Record<string, string> = {
  sugarcane: '#2D8A5F',
  rice: '#D4A017',
  corn: '#E07B39',
  cassava: '#8B5E3C',
};

export const createCustomCrop = (partial: Partial<CropData> & { id: string; name: string }): CropData => {
  const seed = partial.seedCost ?? 500;
  const fert = partial.fertilizerCost ?? 1000;
  const pest = partial.pesticideCost ?? 300;
  const labor = partial.laborCost ?? 1200;
  const harvest = partial.harvestCost ?? 600;
  const other = partial.otherCost ?? 300;
  const totalCost = calcTotalCost(seed, fert, pest, labor, harvest, other);
  const yieldPerRai = partial.yieldPerRai ?? 1;
  const pricePerTon = partial.pricePerTon ?? 5000;
  const revenuePerRai = calcRevenue(yieldPerRai, pricePerTon);
  const netProfit = revenuePerRai - totalCost;
  const roi = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;

  return {
    id: partial.id,
    name: partial.name,
    emoji: partial.emoji ?? '🌱',
    color: 'oklch(0.55 0.18 270)',
    colorHex: '#7C5CBF',
    isDefault: false,
    isCustom: true,
    yieldPerRai,
    pricePerTon,
    revenuePerRai,
    seedCost: seed,
    fertilizerCost: fert,
    pesticideCost: pest,
    laborCost: labor,
    harvestCost: harvest,
    otherCost: other,
    totalCost,
    netProfitPerRai: netProfit,
    roi,
    growthMonths: partial.growthMonths ?? 6,
    waterRequirement: partial.waterRequirement ?? 'ปานกลาง',
    soilType: partial.soilType ?? 'ดินร่วน',
    difficulty: partial.difficulty ?? 3,
    marketDemand: partial.marketDemand ?? 3,
    droughtResistance: partial.droughtResistance ?? 3,
    floodResistance: partial.floodResistance ?? 3,
    harvestsPerYear: partial.harvestsPerYear ?? 1,
    firstHarvestMonths: partial.firstHarvestMonths ?? 6,
    subsequentHarvestMonths: partial.subsequentHarvestMonths ?? 0,
    canRatoon: partial.canRatoon ?? false,
    ratoonYears: partial.ratoonYears ?? 0,
    ratoonInfo: partial.ratoonInfo ?? 'ไม่มีข้อมูล ratoon',
    description: partial.description ?? 'พืชที่เพิ่มโดยผู้ใช้',
    advantages: partial.advantages ?? ['ข้อมูลที่ผู้ใช้กำหนด'],
    disadvantages: partial.disadvantages ?? ['ข้อมูลที่ผู้ใช้กำหนด'],
    bestRegions: partial.bestRegions ?? ['ทั่วประเทศ'],
    harvestSeason: partial.harvestSeason ?? 'ตามฤดูกาล',
    harvestSchedule: partial.harvestSchedule ?? 'ตามฤดูกาล',
    monthlyRevenue: partial.monthlyRevenue ?? Array(12).fill(0).map((_, i) => i === 11 ? revenuePerRai : 0),
    monthlyCost: partial.monthlyCost ?? Array(12).fill(Math.round(totalCost / 12)),
  };
};

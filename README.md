# Sugarcane Advisor 🌾

เว็บไซต์ที่ปรึกษาเกษตรกรรม สำหรับเปรียบเทียบพืชเศรษฐกิจ (อ้อย, ข้าว, ข้าวโพด, มันสำปะหลัง) และคำนวณ ROI

![Preview](https://via.placeholder.com/800x400?text=Sugarcane+Advisor)

## ✨ Features

- **เปรียบเทียบพืช** - เปรียบเทียบอ้อย, ข้าว, ข้าวโพด, มันสำปะหลัง
- **คำนวณ ROI** - คำนวณผลตอบแทนการลงทุนหลายปี รวมเก็บตอ
- **แนวโน้มราคา** - แสดงราคาย้อนหลัง 5 ปี
- **คู่มือการปลูก** - ขั้นตอนการปลูกแบบละเอียด

## 🛠️ Tech Stack

- React 19 + TypeScript
- Tailwind CSS 4
- Recharts (Charts)
- Vite
- pnpm

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/sugarcane-advisor.git
cd sugarcane-advisor

# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## 📦 Deployment to GitHub Pages

### ขั้นตอนการ deploy:

1. **สร้าง Repository ใหม่บน GitHub**
   - ไปที่ https://github.com/new
   - ตั้งชื่อ เช่น `sugarcane-advisor`
   - เลือก Public
   - คลิก "Create repository"

2. **Push โค้ดขึ้น GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sugarcane-advisor.git
   git push -u origin main
   ```

3. **เปิดใช้งาน GitHub Pages**
   - ไปที่ Settings > Pages
   - Source: เลือก **GitHub Actions**
   - รอสักครู่ ให้ workflow รันเสร็จ

4. **เข้าใช้งานเว็บไซต์**
   - หลัง deploy สำเร็จ จะได้ URL เช่น:
   - `https://YOUR_USERNAME.github.io/sugarcane-advisor/`

## 📁 Project Structure

```
sugarcane-advisor/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Data & utilities
│   │   └── contexts/      # React contexts
│   └── public/            # Static assets
├── server/                 # Express server
├── dist/                   # Build output
├── .github/workflows/      # CI/CD
└── package.json
```

## 🎨 Customization

### เพิ่มพืชใหม่
แก้ไขไฟล์ `client/src/lib/cropData.ts`

### เปลี่ยนสี
แก้ไขไฟล์ `client/src/index.css`

## 📄 License

MIT

---

🌾 **Sugarcane Advisor** - เครื่องมือช่วยเหลือเกษตรกรไทย

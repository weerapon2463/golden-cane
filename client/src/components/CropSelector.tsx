// CropSelector.tsx — Toggle buttons for crop selection
// Design: Pill-style toggle buttons with crop colors

import { useCrops } from '@/contexts/CropContext';
import { Plus, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CropSelectorProps {
  onAddCrop?: () => void;
  compact?: boolean;
}

export default function CropSelector({ onAddCrop, compact = false }: CropSelectorProps) {
  const { allCrops, selectedCropIds, toggleCrop, selectAll, deselectAll } = useCrops();

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'p-4 bg-white rounded-xl border border-border shadow-sm'}`}>
      {!compact && (
        <div className="w-full flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Prompt, sans-serif' }}>
            เลือกพืชที่ต้องการเปรียบเทียบ
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-7 px-2">
              <CheckCheck className="w-3 h-3 mr-1" />
              เลือกทั้งหมด
            </Button>
            <Button variant="ghost" size="sm" onClick={deselectAll} className="text-xs h-7 px-2 text-muted-foreground">
              <X className="w-3 h-3 mr-1" />
              ล้าง
            </Button>
          </div>
        </div>
      )}

      {allCrops.map(crop => {
        const isSelected = selectedCropIds.includes(crop.id);
        return (
          <button
            key={crop.id}
            onClick={() => toggleCrop(crop.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
              isSelected
                ? 'text-white shadow-md scale-105'
                : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:scale-102'
            }`}
            style={isSelected ? {
              backgroundColor: crop.colorHex,
              borderColor: crop.colorHex,
            } : {
              borderColor: crop.colorHex + '60',
            }}
          >
            <span className="text-base leading-none">{crop.emoji}</span>
            <span>{crop.name}</span>
            {crop.isCustom && (
              <span className="text-xs opacity-70">(กำหนดเอง)</span>
            )}
          </button>
        );
      })}

      {onAddCrop && (
        <button
          onClick={onAddCrop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" />
          เพิ่มพืช
        </button>
      )}
    </div>
  );
}

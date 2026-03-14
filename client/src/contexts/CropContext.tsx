// CropContext.tsx — Global state for crop comparison
// Design: Modern Agri-Tech Dashboard

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CropData, defaultCrops, createCustomCrop } from '@/lib/cropData';

interface CropContextType {
  allCrops: CropData[];
  selectedCropIds: string[];
  toggleCrop: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  addCustomCrop: (data: Partial<CropData> & { id: string; name: string }) => void;
  removeCustomCrop: (id: string) => void;
  updateCrop: (id: string, data: Partial<CropData>) => void;
  getSelectedCrops: () => CropData[];
  landArea: number;
  setLandArea: (area: number) => void;
}

const CropContext = createContext<CropContextType | null>(null);

export function CropProvider({ children }: { children: React.ReactNode }) {
  const [allCrops, setAllCrops] = useState<CropData[]>(defaultCrops);
  const [selectedCropIds, setSelectedCropIds] = useState<string[]>(['sugarcane', 'rice', 'corn', 'cassava']);
  const [landArea, setLandArea] = useState<number>(10);

  const toggleCrop = useCallback((id: string) => {
    setSelectedCropIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedCropIds(allCrops.map(c => c.id));
  }, [allCrops]);

  const deselectAll = useCallback(() => {
    setSelectedCropIds([]);
  }, []);

  const addCustomCrop = useCallback((data: Partial<CropData> & { id: string; name: string }) => {
    const newCrop = createCustomCrop(data);
    setAllCrops(prev => [...prev, newCrop]);
    setSelectedCropIds(prev => [...prev, newCrop.id]);
  }, []);

  const removeCustomCrop = useCallback((id: string) => {
    setAllCrops(prev => prev.filter(c => c.id !== id || c.isDefault));
    setSelectedCropIds(prev => prev.filter(x => x !== id));
  }, []);

  const updateCrop = useCallback((id: string, data: Partial<CropData>) => {
    setAllCrops(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, ...data };
      updated.revenuePerRai = updated.yieldPerRai * updated.pricePerTon;
      updated.totalCost = updated.seedCost + updated.fertilizerCost + updated.pesticideCost +
        updated.laborCost + updated.harvestCost + updated.otherCost;
      updated.netProfitPerRai = updated.revenuePerRai - updated.totalCost;
      updated.roi = updated.totalCost > 0 ? Math.round((updated.netProfitPerRai / updated.totalCost) * 100) : 0;
      return updated;
    }));
  }, []);

  const getSelectedCrops = useCallback(() => {
    return allCrops.filter(c => selectedCropIds.includes(c.id));
  }, [allCrops, selectedCropIds]);

  return (
    <CropContext.Provider value={{
      allCrops,
      selectedCropIds,
      toggleCrop,
      selectAll,
      deselectAll,
      addCustomCrop,
      removeCustomCrop,
      updateCrop,
      getSelectedCrops,
      landArea,
      setLandArea,
    }}>
      {children}
    </CropContext.Provider>
  );
}

export function useCrops() {
  const ctx = useContext(CropContext);
  if (!ctx) throw new Error('useCrops must be used within CropProvider');
  return ctx;
}

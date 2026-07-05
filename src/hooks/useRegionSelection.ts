import { useState } from "react";

export function useRegionSelection(initialRegion: string | null = null) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(initialRegion);

  const handleRegionClick = (region: string) => {
    setSelectedRegion((prev) => (prev === region ? null : region));
  };

  const clearSelection = () => {
    setSelectedRegion(null);
  };

  return {
    selectedRegion,
    handleRegionClick,
    clearSelection,
  };
}

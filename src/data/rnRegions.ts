export const REGION_MAP: Record<string, string> = {
  // Oeste Potiguar
  micro_240101: "Mossoroense",
  micro_240102: "Mossoroense",
  micro_240103: "Mossoroense",
  micro_240104: "Mossoroense",
  micro_240105: "Alto Apodi",
  micro_240106: "Alto Apodi",
  micro_240107: "Alto Apodi",
  
  // Central Potiguar
  micro_240208: "Litoral Norte",
  micro_240209: "Serras Centrais",
  micro_240210: "Currais Novos",
  micro_240211: "Caicó",
  micro_240212: "Currais Novos",
  
  // Agreste Potiguar
  micro_240313: "Litoral Norte",
  micro_240314: "Agreste",
  micro_240315: "Agreste",
  
  // Leste Potiguar
  micro_240416: "Litoral Norte",
  micro_240417: "Litoral Oriental",
  micro_240418: "Litoral Oriental",
  micro_240419: "Litoral Oriental",
};

export interface PoloMarker {
  region: string;
  label: string;
  x: number;
  y: number;
}

export const POLO_MARKERS: PoloMarker[] = [
  { region: "Alto Apodi", label: "P. FERROS", x: 95, y: 220 },
  { region: "Mossoroense", label: "MOSSORÓ", x: 185, y: 105 },
  { region: "Serras Centrais", label: "ANGICOS", x: 305, y: 150 },
  { region: "Litoral Norte", label: "MACAU", x: 420, y: 85 },
  { region: "Caicó", label: "CAICÓ", x: 255, y: 255 },
  { region: "Currais Novos", label: "C. NOVOS", x: 345, y: 255 },
  { region: "Agreste", label: "N. CRUZ", x: 445, y: 205 },
  { region: "Litoral Oriental", label: "NATAL", x: 535, y: 155 },
];

export interface RegionColor {
  fill: string;
  hover: string;
  select: string;
}

export const REGION_COLORS: Record<string, RegionColor> = {
  "Alto Apodi": {
    fill: "#0284c7",  // Azul
    hover: "#026ba2",
    select: "#014c73"
  },
  "Mossoroense": {
    fill: "#fef08a",  // Amarelo Claro
    hover: "#fde047",
    select: "#ca8a04"
  },
  "Serras Centrais": {
    fill: "#fbcfe8",  // Rosa Claro
    hover: "#f9a8d4",
    select: "#db2777"
  },
  "Caicó": {
    fill: "#94a3b8",  // Cinza/Slate
    hover: "#64748b",
    select: "#334155"
  },
  "Currais Novos": {
    fill: "#60a5fa",  // Azul Claro
    hover: "#2563eb",
    select: "#1d4ed8"
  },
  "Litoral Norte": {
    fill: "#c084fc",  // Roxo/Lilás
    hover: "#a855f7",
    select: "#7e22ce"
  },
  "Agreste": {
    fill: "#fda4af",  // Rosa
    hover: "#f43f5e",
    select: "#be123c"
  },
  "Litoral Oriental": {
    fill: "#86efac",  // Verde Claro
    hover: "#4ade80",
    select: "#15803d"
  }
};

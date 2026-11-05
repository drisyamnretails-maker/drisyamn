// components/createreels/BeautyEngine.ts

// Facial Landmark Indices (MediaPipe FaceMesh 468/478 points)
export const LIPS_OUTER = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 
  308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78
];

export const LIPS_INNER = [
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 
  415, 310, 311, 312, 13, 82, 81, 42, 183, 78
];

export const LEFT_EYE = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];
export const RIGHT_EYE = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382];

export const LEFT_CHEEK = [116, 117, 118, 100, 123, 147, 213, 192, 214];
export const RIGHT_CHEEK = [345, 346, 347, 329, 352, 376, 433, 416, 434];

// Filter Presets Definition
export interface FilterPreset {
  smooth: number;
  bright: number;
  blush: number;
  eyeShadow: boolean;
  lipColor: [number, number, number, number]; // [R, G, B, Alpha]
  warm: number;
}

export const FILTER_PRESETS: Record<string, FilterPreset> = {
  // --- WOMAN PRESETS ---
  natural: {
    smooth: 0.3,
    bright: 1.05,
    blush: 0.2,
    eyeShadow: false,
    lipColor: [210, 105, 110, 0.35], // Soft nude pink
    warm: 0.1,
  },
  soft: {
    smooth: 0.5,
    bright: 1.1,
    blush: 0.4,
    eyeShadow: true,
    lipColor: [225, 85, 100, 0.45], // Rosy pink
    warm: 0.2,
  },
  glam: {
    smooth: 0.7,
    bright: 1.15,
    blush: 0.6,
    eyeShadow: true,
    lipColor: [128, 0, 32, 0.65], // Deep Maroon match!
    warm: 0.3,
  },
  bold: {
    smooth: 0.6,
    bright: 1.12,
    blush: 0.7,
    eyeShadow: true,
    lipColor: [200, 30, 50, 0.7], // Vibrant Red
    warm: 0.15,
  },
  baby: {
    smooth: 0.4,
    bright: 1.08,
    blush: 0.5,
    eyeShadow: false,
    lipColor: [240, 140, 150, 0.4], // Peach gloss
    warm: 0.25,
  },

  // --- MAN PRESETS ---
  man_natural: {
    smooth: 0.2,
    bright: 1.0,
    blush: 0.0,
    eyeShadow: false,
    lipColor: [0, 0, 0, 0],
    warm: 0.05,
  },
  man_clear: {
    smooth: 0.4,
    bright: 1.05,
    blush: 0.0,
    eyeShadow: false,
    lipColor: [0, 0, 0, 0],
    warm: 0.1,
  },
  man_sharp: {
    smooth: 0.3,
    bright: 1.08,
    blush: 0.0,
    eyeShadow: false,
    lipColor: [0, 0, 0, 0],
    warm: -0.1, // Cool sharp tone
  },
  man_cool: {
    smooth: 0.5,
    bright: 1.1,
    blush: 0.0,
    eyeShadow: false,
    lipColor: [0, 0, 0, 0],
    warm: -0.15,
  },
  man_baby: {
    smooth: 0.4,
    bright: 1.05,
    blush: 0.0,
    eyeShadow: false,
    lipColor: [0, 0, 0, 0],
    warm: 0.15,
  },
};
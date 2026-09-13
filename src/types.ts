export type ControllerPlatform = 'ps5' | 'xbox' | 'phone' | 'pc';

export interface GTA5Cheat {
  id: string;
  name: string;
  category: 'Combat & Survival' | 'Police & Wanted' | 'Vehicles & Aircraft' | 'Player Perks' | 'World & Physics';
  description: string;
  duration: string;
  warning?: string;
  ps5: string[];
  xbox: string[];
  phone: string;
  phoneRaw: string;
  pcCode: string;
  icon: string;
}

export interface LaunchTimeline {
  projectedReleaseDate: string;
  targetPlatforms: string[];
  engine: string;
  setting: string;
  protagonists: string[];
}

export type RiskPinCategory = 
  | 'bedridden'        // สีน้ำเงิน: จุดผู้ป่วยติดเตียง
  | 'flood_zone'       // สีแดง: จุดโซนน้ำท่วมก่อน (จุดอันตรายรถห้ามผ่าน)
  | 'pu_ta_shrine'     // สีม่วง: ศาลปู่ตา
  | 'community_hall'   // สีชมพู: ศาลาชุมชน
  | 'elderly'          // สีส้ม: จุดมีผู้สูงอายุ
  | 'disabled'         // สีเขียว: จุดมีผู้พิการ
  | 'children'         // สีเขียวอ่อน: จุดมีเด็ก
  | 'electric_hazard'  // สีฟ้า: จุดที่เคยมีไฟรั่ว
  | 'shelter'          // จุดพักพิงและจุดช่วยเหลือ
  | 'authority'        // จุดประสานงานเจ้าหน้าที่
  | 'road_closure';    // จุดถนนที่ควรหลีกเลี่ยง

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskPoint {
  id: string;
  name: string;
  category: RiskPinCategory;
  categoryLabel: string;
  riskLevel: RiskLevel;
  lat: number;
  lng: number;
  description: string;
  warning?: string;
  surveyDate: string;
  responsibleOrg: string;
  addressOrZone: string;
  contact?: string;
  facilities?: string[];
  operatingHours?: string;
  travelAdvice?: string;
  imageUrl?: string;
  verified: boolean;
  minWaterLevelTrigger?: number; // M.7 water level in meters that triggers this risk
}

export interface SurveillanceZone {
  id: string;
  name: string;
  code: string;
  description: string;
  riskType: string;
  patrolFrequency: string;
  responsibleUnit: string;
  coordinates: [number, number][];
  active: boolean;
}

export interface HazardReport {
  id: string;
  reportType: 'flood' | 'electric' | 'road' | 'surveillance' | 'other';
  title: string;
  category: RiskPinCategory;
  riskLevel: RiskLevel;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  reportedAt: string;
  reporterName: string;
  reporterPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  adminNote?: string;
  imageUrl?: string;
}

export interface RiverM7Data {
  stationCode: string;
  location: string;
  currentLevelM: number;
  criticalLevelM: number; // 7.00 m = bank overflow
  warningLevelM: number;  // 6.00 m
  flowRateM3s: number;
  trend: 'rising' | 'steady' | 'falling';
  updatedAt: string;
}

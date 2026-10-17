import React, { useState } from 'react';
import { RiskPoint } from '../types';
import { Compass, AlertTriangle, ShieldCheck, ArrowRight, Navigation, Phone, CheckCircle, MapPin, X } from 'lucide-react';

interface SafeRoutePlannerProps {
  isOpen: boolean;
  onClose: () => void;
  riskPoints: RiskPoint[];
  currentWaterLevel: number;
}

export const SafeRoutePlanner: React.FC<SafeRoutePlannerProps> = ({
  isOpen,
  onClose,
  riskPoints,
  currentWaterLevel
}) => {
  const [startPoint, setStartPoint] = useState('hat_suanya_north');
  const [destination, setDestination] = useState('shelter_wat_warin');

  if (!isOpen) return null;

  const startLocations = [
    { id: 'hat_suanya_north', name: 'คุ้มหาดสวนยาเหนือ (ติดขอบแม่น้ำมูล)', zone: 'โซนเสี่ยงสูงพิเศษ' },
    { id: 'hat_suanya_soi2', name: 'ซอยหาดสวนยา 2 (ใกล้หม้อแปลงไฟฟ้า)', zone: 'โซนเสี่ยงไฟฟ้า' },
    { id: 'hat_suanya_center', name: 'กลางชุมชนหาดสวนยา (ศาลาชุมชน)', zone: 'โซนกลางชุมชน' },
    { id: 'hat_suanya_shrine', name: 'คุ้มศาลปู่ตา (ตะวันออก)', zone: 'โซนเนินสูง' },
    { id: 'hat_suanya_bridge', name: 'เชิงสะพานเสรีประชาธิปไตย', zone: 'จุดเชื่อมต่อถนนใหญ่' },
  ];

  const destinationLocations = [
    { id: 'shelter_wat_warin', name: 'ศูนย์พักพิงชั่วคราว วัดวารินทราราม', desc: 'ปลอดภัย 100% มีโรงครัวและแพทย์' },
    { id: 'shelter_school', name: 'ศูนย์พักพิง รร.เทศบาลวารินวิชาชาติ', desc: 'มีอาคารเรียนยกสูง ปลอดภัย' },
    { id: 'muni_center', name: 'ศูนย์อำนวยการช่วยเหลือ เทศบาลเมืองวารินชำราบ', desc: 'จุดประสานงานเรือและถุงยังชีพ' },
    { id: 'ubon_city_bridge', name: 'ทางข้ามสะพานเสรีประชาธิปไตย (ไปฝั่งเมืองอุบลฯ)', desc: 'เข้าสู่เทศบาลนครอุบลราชธานี' },
  ];

  // Route Safety Assessment logic
  const getRouteEvaluation = () => {
    const isNorthOrSoi2 = startPoint === 'hat_suanya_north' || startPoint === 'hat_suanya_soi2';
    const isWaterHigh = currentWaterLevel >= 6.5;

    if (isNorthOrSoi2 && isWaterHigh) {
      return {
        status: 'danger',
        title: 'เส้นทางมีความเสี่ยงสูงมาก - ห้ามใช้รถยนต์หรือเดินลุยน้ำลำพัง',
        warnings: [
          'ทางเลียบตลิ่งแม่น้ำมูลและซอย 1-2 มีน้ำท่วมสูงกว่า 80 ซม. กระแสน้ำเชี่ยว',
          'มีจุดเสี่ยงจากระบบไฟฟ้าบริเวณหม้อแปลงซอยหาดสวนยา 2 เสี่ยงไฟฟ้ารั่ว',
        ],
        safePath: 'ประสานเรือท้องแบนกู้ภัยมูลนิธิสว่างบูชาธรรม หรือ ปภ. เพื่อรับตัวออกจากจุดติดขอบน้ำ ผ่านแนวคลองเลี่ยงเข้าสู่ซอยประทุมเทพ 4',
        vehicleRecommended: 'เรือกู้ภัยท้องแบน / รถบรรทุกยกสูงทหารเท่านั้น',
        distanceKm: '1.1 กม. (โดยเรือ + เดินเท้าสู่ศูนย์พักพิง)',
        emergencyContact: '045-321151 (ศูนย์กู้ชีพวารินชำราบ) หรือ 1669'
      };
    } else if (startPoint === 'hat_suanya_bridge') {
      return {
        status: 'caution',
        title: 'เส้นทางผ่านจุดชะลอตัว - น้ำเริ่มปริ่มผิวถนนเชิงสะพาน',
        warnings: [
          'มีน้ำเอ่อขัง 1 ช่องจราจรบริเวณเชิงสะพานเสรีประชาธิปไตย',
          'ควรระวังคลื่นน้ำจากการสัญจรของรถบรรทุก'
        ],
        safePath: 'ใช้ถนนหลักเชื่อมต่อถนนสถลมาร์ค มุ่งหน้าตรงไปยังถนนประทุมเทพ เลี้ยวซ้ายเข้าวัดวารินทราราม',
        vehicleRecommended: 'รถยนต์ยกสูง, รถกระบะ, มอเตอร์ไซค์ยกสูง',
        distanceKm: '0.8 กม.',
        emergencyContact: 'สภ.วารินชำราบ 045-321215'
      };
    } else {
      return {
        status: 'safe',
        title: 'เส้นทางแนะนำปลอดภัย - สัญจรได้ตามปกติ',
        warnings: [
          'พกร่มหรือเสื้อกันฝน ระวังทางลาดลื่น'
        ],
        safePath: 'เดินทางผ่านถนนคอนกรีตกลางชุมชน ออกสู่ถนนเชื่อมเชิงสะพาน และเข้าสู่ที่ตั้งศูนย์พักพิง',
        vehicleRecommended: 'เดินเท้า, รถจักรยานยนต์, รถยนต์ทั่วไป',
        distanceKm: '0.7 กม.',
        emergencyContact: 'กรรมการชุมชนหาดสวนยา 081-998-7766'
      };
    }
  };

  const evalResult = getRouteEvaluation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-300 font-medium">เครื่องมือประเมินความปลอดภัยการสัญจร</div>
              <h2 className="text-lg font-bold">วางแผนเส้นทางปลอดภัย (Safe Route Advisory)</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                จุดเริ่มต้น (ในชุมชนหาดสวนยา)
              </label>
              <select
                value={startPoint}
                onChange={e => setStartPoint(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {startLocations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                ปลายทางปลอดภัยที่ต้องการไป
              </label>
              <select
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {destinationLocations.map(dest => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assessment Result Box */}
          <div className={`p-4 rounded-xl border ${
            evalResult.status === 'danger' ? 'bg-red-50 border-red-200 text-red-950' :
            evalResult.status === 'caution' ? 'bg-amber-50 border-amber-200 text-amber-950' :
            'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3">
              {evalResult.status === 'danger' ? (
                <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : evalResult.status === 'caution' ? (
                <div className="p-2 bg-amber-600 text-white rounded-lg shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="font-bold text-sm sm:text-base">
                  {evalResult.title}
                </div>

                {/* Warnings */}
                <div className="space-y-1">
                  {evalResult.warnings.map((w, idx) => (
                    <div key={idx} className="text-xs flex items-center gap-1.5 font-medium opacity-90">
                      <span>•</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Path description */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs space-y-2">
              <div>
                <strong className="block text-[11px] uppercase tracking-wider text-slate-600 mb-0.5">
                  เส้นทางและวิธีการสัญจรที่แนะนำ:
                </strong>
                <p className="leading-relaxed font-normal text-slate-800">
                  {evalResult.safePath}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-500">ยานพาหนะที่เหมาะสม: </span>
                  <span className="font-bold text-slate-800">{evalResult.vehicleRecommended}</span>
                </div>
                <div>
                  <span className="text-slate-500">ระยะทางโดยประมาณ: </span>
                  <span className="font-bold text-slate-800 tabular-nums">{evalResult.distanceKm}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency coordination strip */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>สายด่วนฉุกเฉินประสานการอพยพ: <strong>{evalResult.emergencyContact}</strong></span>
            </div>
            <span className="text-[10px] text-slate-400">บริการ 24 ชม.</span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              รับทราบคำแนะนำ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

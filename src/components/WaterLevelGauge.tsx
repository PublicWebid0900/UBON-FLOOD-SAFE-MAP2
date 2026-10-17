import React from 'react';
import { RiverM7Data } from '../types';
import { Waves, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface WaterLevelGaugeProps {
  riverData: RiverM7Data;
  activeSimulatedLevel: number;
  onSelectScenario: (level: number) => void;
}

export const WaterLevelGauge: React.FC<WaterLevelGaugeProps> = ({
  riverData,
  activeSimulatedLevel,
  onSelectScenario
}) => {
  const scenarios = [
    { level: 4.50, label: 'ปกติ', desc: 'ระดับแม่น้ำมูลปกติ' },
    { level: 6.20, label: 'เฝ้าระวัง', desc: 'น้ำเริ่มแตะขอบตลิ่งหาดสวนยา' },
    { level: 6.85, label: 'ปริ่มตลิ่ง (ปัจจุบัน)', desc: 'น้ำเอ่อท่วมคุ้มริมน้ำและทางเลียบ' },
    { level: 7.50, label: 'วิกฤตล้นตลิ่ง', desc: 'น้ำท่วมลึก ชุมชนต้องอพยพด่วน' },
    { level: 10.97, label: 'มหาอุทกภัย 2562', desc: 'ระดับสูงสุดเป็นประวัติการณ์' }
  ];

  // Calculate percentage of bar (relative to max scale 12m)
  const percent = Math.min(100, Math.max(0, (activeSimulatedLevel / 12) * 100));
  const bankPercent = (7.00 / 12) * 100;
  const warningPercent = (6.00 / 12) * 100;

  const isCritical = activeSimulatedLevel >= 7.00;
  const isWarning = activeSimulatedLevel >= 6.00 && activeSimulatedLevel < 7.00;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>สถานีวัดระดับน้ำ M.7</span>
            <span aria-hidden="true">·</span>
            <span>สะพานเสรีประชาธิปไตย 2497</span>
            <span aria-hidden="true">·</span>
            <span>อ.เมือง - อ.วารินชำราบ</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            ระดับน้ำแม่น้ำมูลและสถานการณ์ความเสี่ยง
          </h2>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2">
          {isCritical ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>ระดับวิกฤต (ล้นตลิ่ง)</span>
            </div>
          ) : isWarning ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>ระดับเฝ้าระวังสูง</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ระดับปกติ</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-center border-b border-slate-100">
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">ระดับน้ำแสดงผล</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-700">
            {activeSimulatedLevel.toFixed(2)} <span className="text-sm font-sans font-normal text-slate-600">ม.</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">เทียบระดับตลิ่ง 7.00 ม.</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">ระดับตลิ่ง M.7</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-800">
            7.00 <span className="text-sm font-sans font-normal text-slate-600">ม.</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">(112.00 ม.รทก.)</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">อัตราการไหลประมาณ</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-800">
            {(riverData.flowRateM3s * (activeSimulatedLevel / 6.85)).toFixed(0)} <span className="text-sm font-sans font-normal text-slate-600">ลบ.ม./วินาที</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">แม่น้ำมูลตอนล่าง</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">แนวโน้มสถานการณ์</div>
          <div className="text-xl font-bold text-slate-800 flex items-center justify-center gap-1.5 h-8">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-base font-semibold">
              {activeSimulatedLevel > 7.0 ? 'เพิ่มขึ้นรวดเร็ว' : 'ทรงตัวค่อนข้างสูง'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">สถานีอุทกวิทยาอุบลฯ</div>
        </div>
      </div>

      {/* Visual Water Level Gauge Bar */}
      <div className="pt-4">
        <div className="flex justify-between items-center text-xs text-slate-600 mb-2">
          <span>มาตรวัดระดับน้ำสัมพันธ์กับพื้นที่ชุมชนหาดสวนยา</span>
          <span className="font-mono text-slate-500 tabular-nums">0.00 ม. ถึง 12.00 ม.</span>
        </div>

        <div className="relative w-full h-7 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          {/* Warning Threshold marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
            style={{ left: `${warningPercent}%` }}
            title="ขีดเตือนภัย 6.00 ม."
          />
          {/* Bank Overflow Threshold marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
            style={{ left: `${bankPercent}%` }}
            title="ระดับตลิ่ง 7.00 ม."
          />

          {/* Water Fill Bar */}
          <div
            className={`h-full transition-all duration-500 ease-out flex items-center justify-end pr-2 text-white text-xs font-bold font-mono tabular-nums ${
              isCritical ? 'bg-gradient-to-r from-blue-500 via-amber-500 to-red-600' : 
              isWarning ? 'bg-gradient-to-r from-blue-400 to-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${percent}%` }}
          >
            {percent > 15 && `${activeSimulatedLevel.toFixed(2)}m`}
          </div>
        </div>

        {/* Labels below bar */}
        <div className="relative w-full h-6 text-[10px] text-slate-500 mt-1">
          <span className="absolute left-0">0.0 ม. (แห้ง)</span>
          <span className="absolute -translate-x-1/2 text-amber-700 font-medium" style={{ left: `${warningPercent}%` }}>
            เตือนภัย 6.0 ม.
          </span>
          <span className="absolute -translate-x-1/2 text-red-600 font-semibold" style={{ left: `${bankPercent}%` }}>
            ล้นตลิ่ง 7.0 ม.
          </span>
          <span className="absolute right-0">12.0 ม.</span>
        </div>
      </div>

      {/* Interactive Scenario Buttons */}
      <div className="pt-3 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <span>จำลองสถานการณ์ระดับน้ำเพื่อทดสอบการตอบสนองของแผนที่:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {scenarios.map(s => {
            const isActive = Math.abs(activeSimulatedLevel - s.level) < 0.05;
            return (
              <button
                key={s.level}
                onClick={() => onSelectScenario(s.level)}
                className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{s.label}</span>
                  <span className="font-mono text-[11px] tabular-nums text-slate-500">{s.level.toFixed(2)}m</span>
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {s.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

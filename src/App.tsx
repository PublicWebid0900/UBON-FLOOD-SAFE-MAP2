import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RiskMap } from './components/RiskMap';
import { WaterLevelGauge } from './components/WaterLevelGauge';
import { ReportHazardModal } from './components/ReportHazardModal';
import { OfficerVerifyModal } from './components/OfficerVerifyModal';
import { SafeRoutePlanner } from './components/SafeRoutePlanner';
import { FloodHistoryModal } from './components/FloodHistoryModal';
import { ProjectOverviewModal } from './components/ProjectOverviewModal';
import { 
  INITIAL_RISK_POINTS, 
  INITIAL_SURVEILLANCE_ZONES, 
  INITIAL_CITIZEN_REPORTS, 
  INITIAL_M7_RIVER_DATA,
  PROJECT_DETAILS 
} from './data/mockData';
import { RiskPoint, HazardReport } from './types';
import { 
  AlertTriangle, Shield, Phone, Zap, Users, 
  MapPin, Bell, CheckCircle2, ChevronRight, ExternalLink,
  Info, Compass, Activity, ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [riskPoints, setRiskPoints] = useState<RiskPoint[]>(INITIAL_RISK_POINTS);
  const [surveillanceZones] = useState(INITIAL_SURVEILLANCE_ZONES);
  const [citizenReports, setCitizenReports] = useState<HazardReport[]>(INITIAL_CITIZEN_REPORTS);
  const [activeWaterLevel, setActiveWaterLevel] = useState<number>(6.85);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Coordinate picking mode for map
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedCoordinates, setPickedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Live Toast Notification
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'info' | 'success' | 'alert' } | null>({
    message: 'แจ้งเตือน: ระดับน้ำแม่น้ำมูลสถานี M.7 อยู่ที่ 6.85 ม. โปรดหลีกเลี่ยงแนวตลิ่งหาดสวนยา',
    type: 'alert'
  });

  const triggerToast = (message: string, type: 'info' | 'success' | 'alert') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 6000);
  };

  // Handle citizen submit report
  const handleSubmitReport = (newReportData: Omit<HazardReport, 'id' | 'reportedAt' | 'status'>) => {
    const newReport: HazardReport = {
      ...newReportData,
      id: `rep-${Date.now()}`,
      reportedAt: new Date().toLocaleString('th-TH', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }) + ' น.',
      status: 'pending'
    };

    setCitizenReports(prev => [newReport, ...prev]);
    setIsPickingLocation(false);
    triggerToast(`ได้รับข้อมูล "${newReport.title}" แล้ว กำลังส่งให้เจ้าหน้าที่ตรวจสอบ`, 'info');
  };

  // Handle officer approval (converts citizen report into live map risk point)
  const handleApproveReport = (id: string, adminNote: string, verifiedBy: string) => {
    const report = citizenReports.find(r => r.id === id);
    if (!report) return;

    // Update report status
    setCitizenReports(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'approved',
      adminNote,
      verifiedBy,
      verifiedAt: new Date().toLocaleTimeString('th-TH')
    } : r));

    // Add to active map points
    const newMapPoint: RiskPoint = {
      id: `point-${id}`,
      name: report.title,
      category: report.category,
      categoryLabel: report.category === 'electric_hazard' ? 'จุดเสี่ยงไฟฟ้ารั่ว (รับแจ้งใหม่)' : 'จุดน้ำท่วม/ถนนเลี่ยง (รับแจ้งใหม่)',
      riskLevel: report.riskLevel,
      lat: report.lat,
      lng: report.lng,
      description: report.description,
      warning: report.category === 'electric_hazard' 
        ? 'ระมัดระวัง ห้ามสัมผัสอุปกรณ์ไฟฟ้าหรือเข้าใกล้บริเวณที่มีน้ำท่วมและระบบไฟฟ้า' 
        : 'จุดน้ำท่วมขังสูง โปรดใช้ความระมัดระวังในการสัญจร',
      surveyDate: 'วันนี้ (ประชาชนแจ้ง)',
      responsibleOrg: verifiedBy,
      addressOrZone: report.locationName,
      contact: report.reporterPhone,
      imageUrl: report.imageUrl,
      verified: true
    };

    setRiskPoints(prev => [newMapPoint, ...prev]);

    // Broadcast toast notification to all users as specified in PDF page 6 step 4
    triggerToast(`จุดเสี่ยงใหม่ได้รับการยืนยัน: "${report.title}" ปรากฏบนแผนที่แล้ว`, 'success');
  };

  const handleRejectReport = (id: string, reason: string) => {
    setCitizenReports(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'rejected',
      adminNote: reason
    } : r));
    triggerToast(`ปฏิเสธคำขอรายงานจุดเสี่ยง: ${reason}`, 'info');
  };

  const handlePickCoordinateOnMap = (coords: { lat: number; lng: number }) => {
    setPickedCoordinates(coords);
    setIsPickingLocation(false);
    setIsReportModalOpen(true);
    triggerToast(`เลือกพิกัด [${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}] สำเร็จ`, 'info');
  };

  const pendingReportsCount = citizenReports.filter(r => r.status === 'pending').length;

  // Filter stats
  const vulnerableCount = riskPoints.filter(p => ['bedridden', 'elderly', 'disabled', 'children'].includes(p.category)).length;
  const electricHazardCount = riskPoints.filter(p => p.category === 'electric_hazard').length;
  const floodPointsCount = riskPoints.filter(p => p.category === 'flood_zone' || p.category === 'road_closure').length;
  const shelterCount = riskPoints.filter(p => p.category === 'shelter').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 3-Zone Standard Top Navigation */}
      <Navbar
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenRoutePlanner={() => setIsRoutePlannerOpen(true)}
        onOpenOfficerPortal={() => setIsOfficerModalOpen(true)}
        pendingReportsCount={pendingReportsCount}
        currentWaterLevel={activeWaterLevel}
      />

      {/* Floating Toast Notification (Step 4 Broadcast) */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="p-1 rounded-lg shrink-0 mt-0.5">
            {activeToast.type === 'alert' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : activeToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Bell className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <div className="flex-1 text-xs leading-relaxed">
            {activeToast.message}
          </div>
          <button 
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Kicker & Editorial Introduction */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
              <span>คณะรัฐศาสตร์ มหาวิทยาลัยอุบลราชธานี</span>
              <span aria-hidden="true">·</span>
              <span>ชุมชนบ้านหาดสวนยา อ.วารินชำราบ</span>
              <span aria-hidden="true">·</span>
              <span>ปีการศึกษา 2569</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-3">
              แผนที่ดิจิทัลเพื่อการจัดการความเสี่ยงและความปลอดภัยของประชาชนในสถานการณ์น้ำท่วม
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              เปลี่ยนจากการรับรู้ปัญหาแบบ <strong className="text-slate-900 font-semibold">"เกิดเหตุแล้วจึงแก้ไข"</strong> มาเป็นการ <strong className="text-blue-700 font-semibold">"รู้จุดเสี่ยงล่วงหน้า เตือนประชาชน และเตรียมการรับมือ"</strong> ผสานข้อมูลภาคสนาม ตำแหน่งกลุ่มเปราะบาง ระบบไฟฟ้า จุดพักพิง และการมีส่วนร่วมของประชาชนชุมชนหาดสวนยา
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <div className="text-[11px] text-blue-800 font-medium mb-0.5">จุดเสี่ยงระบบไฟฟ้า (สีฟ้า)</div>
              <div className="text-2xl font-bold font-mono text-blue-900 tabular-nums">{electricHazardCount}</div>
              <div className="text-[10px] text-blue-700/80 mt-0.5">กฟภ. วารินชำราบ ตรวจสอบ</div>
            </div>

            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
              <div className="text-[11px] text-red-800 font-medium mb-0.5">จุดน้ำท่วม/ปิดถนน (สีแดง)</div>
              <div className="text-2xl font-bold font-mono text-red-900 tabular-nums">{floodPointsCount}</div>
              <div className="text-[10px] text-red-700/80 mt-0.5">รถห้ามผ่าน / ทางเลี่ยง</div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <div className="text-[11px] text-amber-800 font-medium mb-0.5">กลุ่มเปราะบางที่ต้องอพยพ</div>
              <div className="text-2xl font-bold font-mono text-amber-900 tabular-nums">{vulnerableCount}</div>
              <div className="text-[10px] text-amber-700/80 mt-0.5">ติดเตียง · สูงอายุ · พิการ · เด็ก</div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[11px] text-emerald-800 font-medium mb-0.5">ศูนย์พักพิงและจุดช่วยเหลือ</div>
              <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">{shelterCount}</div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5">วัดวารินทราราม & รร.เทศบาลฯ</div>
            </div>
          </div>
        </section>

        {/* M.7 Water Level Gauge & Interactive Simulator */}
        <WaterLevelGauge
          riverData={INITIAL_M7_RIVER_DATA}
          activeSimulatedLevel={activeWaterLevel}
          onSelectScenario={(level) => {
            setActiveWaterLevel(level);
            if (level >= 7.00) {
              triggerToast(`ระดับน้ำจำลอง ${level.toFixed(2)} ม. สูงเกินระดับตลิ่ง 7.00 ม.! ชุมชนหาดสวนยาได้รับผลกระทบฉับพลัน`, 'alert');
            } else {
              triggerToast(`ปรับระดับน้ำจำลองเป็น ${level.toFixed(2)} ม.`, 'info');
            }
          }}
        />

        {/* Primary Interactive Map Section */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                แผนที่ระบุจุดเสี่ยงชุมชนบ้านหาดสวนยา (UBON FLOOD SAFE MAP)
              </h2>
              <div className="text-xs text-slate-500">
                คลิกที่หมุดบนแผนที่เพื่อดูข้อมูลความเสี่ยง คำเตือนไฟฟ้ารั่ว วันที่สำรวจ และเบอร์ติดต่อช่วยเหลือ
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRoutePlannerOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                เช็คเส้นทางปลอดภัย
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                แจ้งจุดเสี่ยงใหม่
              </button>
            </div>
          </div>

          {/* Leaflet Map */}
          <RiskMap
            riskPoints={riskPoints}
            surveillanceZones={surveillanceZones}
            activeWaterLevel={activeWaterLevel}
            isPickingLocation={isPickingLocation}
            onPickCoordinate={handlePickCoordinateOnMap}
          />
        </section>

        {/* 3 Key High-Risk Zones in Hat Suan Ya (from PDF Page 4) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">ข้อมูลกายภาพพื้นที่ศึกษา (Physical Topography)</div>
              <h3 className="text-base font-bold text-slate-900">
                1. จุดเสี่ยงสำคัญ 3 โซนในพื้นที่ชุมชนบ้านหาดสวนยา
              </h3>
            </div>
            <span className="text-xs text-blue-600 font-medium hidden sm:inline">
              อิงผลสำรวจภาคสนาม
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Zone 1 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-900">พื้นที่ติดขอบแม่น้ำมูล (ทิศเหนือและตะวันออก)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                เสี่ยงสูงที่สุดต่อการเกิดน้ำท่วมฉับพลัน ล้นตลิ่ง และการกัดเซาะของชายฝั่งริมแม่น้ำ บ้านเรือนชั้นล่างจมน้ำก่อนจุดอื่น
              </p>
              <div className="pt-1 text-[11px] text-red-700 font-medium">
                • ระดับความเสี่ยง: สูงมาก (ต้องอพยพก่อน)
              </div>
            </div>

            {/* Zone 2 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-900">แนวริมถนนหลักใกล้เชิงสะพาน (ทิศตะวันตก)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                พื้นที่เสี่ยงด้านการจราจรและการสัญจรหนีภัย เชื่อมต่อกับสะพานเสรีประชาธิปไตย 2497 มีน้ำเอ่อท่วมผิวจราจรและทางเลียบ
              </p>
              <div className="pt-1 text-[11px] text-amber-700 font-medium">
                • ระดับความเสี่ยง: ปานกลาง (ระวังคลื่นและรถติด)
              </div>
            </div>

            {/* Zone 3 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-900">พื้นที่ราบต่ำตอนในชุมชน (แอ่งกระทะ)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                เสี่ยงต่อการเกิดน้ำท่วมขังขังนาน เนื่องจากเป็นพื้นที่รับน้ำและระบายน้ำลงสู่แม่น้ำได้ช้าเมื่อระดับแม่น้ำมูลมีปริมาณสูง
              </p>
              <div className="pt-1 text-[11px] text-blue-700 font-medium">
                • ระดับความเสี่ยง: เสี่ยงขังยาวนาน (ต้องการเครื่องสูบน้ำ)
              </div>
            </div>
          </div>
        </section>

        {/* Recent Citizen Reports Stream & Emergency Coordination Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Recent Community Reports (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-500">การมีส่วนร่วมของภาคประชาชน</div>
                <h3 className="text-base font-bold text-slate-900">
                  รายงานจุดเสี่ยงล่าสุดจากคนในชุมชนหาดสวนยา
                </h3>
              </div>

              <button
                onClick={() => setIsOfficerModalOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>เปิดดูระบบตรวจรับรอง ({pendingReportsCount} รายการ)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {citizenReports.slice(0, 3).map((report) => (
                <div 
                  key={report.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        report.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {report.status === 'approved' ? 'อนุมัติขึ้นแผนที่แล้ว' : report.status === 'rejected' ? 'ปฏิเสธ' : 'รอเจ้าหน้าที่ตรวจสอบ'}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{report.title}</span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{report.locationName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-400 tabular-nums">{report.reportedAt}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {report.status === 'pending' ? (
                      <button
                        onClick={() => setIsOfficerModalOpen(true)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        ตรวจสอบ
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ยืนยันแล้ว
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span>พบเห็นสถานการณ์ผิดปกติ? กดที่นี่เพื่อส่งข้อมูลแจ้งจุดเสี่ยง</span>
              </button>
            </div>
          </div>

          {/* Right Column: Emergency Hotlines & Coordination Contacts (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <div className="text-xs text-slate-500">สายด่วนช่วยเหลือ 24 ชั่วโมง</div>
              <h3 className="text-base font-bold text-slate-900">
                เบอร์ติดต่อฉุกเฉินพื้นที่วารินชำราบ
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'เทศบาลเมืองวารินชำราบ (กู้ภัย/ดับเพลิง)', phone: '045-321151 / 199', desc: 'ประสานเรือและถุงยังชีพ' },
                { name: 'กฟภ. วารินชำราบ (ตัดไฟฉุกเฉิน)', phone: '1129 / 045-321234', desc: 'แจ้งเสาไฟจมน้ำ ไฟฟ้ารั่ว' },
                { name: 'มูลนิธิสว่างบูชาธรรมสถาน', phone: '045-321555 / 1669', desc: 'เรือกู้ภัยรับส่งผู้ป่วยฉุกเฉิน' },
                { name: 'สภ.วารินชำราบ (สายตรวจลาดตระเวน)', phone: '045-321215', desc: 'แจ้งเหตุขโมย บุกรุกบ้านช่วงอพยพ' },
                { name: 'สายด่วนนิรภัย ปภ. อุบลราชธานี', phone: '1784', desc: 'ศูนย์เตือนภัยพิบัติแห่งชาติ' }
              ].map((hotline, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{hotline.name}</div>
                    <div className="text-[10px] text-slate-500">{hotline.desc}</div>
                  </div>
                  <a 
                    href={`tel:${hotline.phone.split('/')[0].trim()}`}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded text-blue-600 font-mono font-bold hover:bg-blue-50 transition-colors shrink-0"
                  >
                    {hotline.phone}
                  </a>
                </div>
              ))}
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
              <strong>ศูนย์ประสานงาน อสม. หาดสวนยา:</strong>
              <p className="text-[11px] mt-0.5 text-indigo-800">
                พร้อมสนับสนุนการเคลื่อนย้ายผู้ป่วยติดเตียงและผู้สูงอายุตลอดเวลา
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-800 mb-0.5">
              UBON FLOOD SAFE MAP (โครงการ แผนที่ระบุจุดเสี่ยง)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-slate-500">
              <span>ชุมชนบ้านหาดสวนยา เทศบาลเมืองวารินชำราบ จ.อุบลราชธานี</span>
              <span aria-hidden="true">·</span>
              <span>คณะรัฐศาสตร์ มหาวิทยาลัยอุบลราชธานี</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              รายนามผู้จัดทำ & อาจารย์ที่ปรึกษา
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              บทเรียนน้ำท่วมปี 2562
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleSubmitReport}
        initialCoords={pickedCoordinates}
        onStartPickLocation={() => {
          setIsPickingLocation(true);
          triggerToast('กรุณาคลิกบนจุดใดก็ได้ในแผนที่เพื่อระบุตำแหน่ง', 'info');
        }}
      />

      <OfficerVerifyModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        reports={citizenReports}
        onApproveReport={handleApproveReport}
        onRejectReport={handleRejectReport}
      />

      <SafeRoutePlanner
        isOpen={isRoutePlannerOpen}
        onClose={() => setIsRoutePlannerOpen(false)}
        riskPoints={riskPoints}
        currentWaterLevel={activeWaterLevel}
      />

      <FloodHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <ProjectOverviewModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
}

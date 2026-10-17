import React, { useState } from 'react';
import { HazardReport, RiskPinCategory, RiskLevel } from '../types';
import { droneImg, rescueImg, electricImg } from '../assets/images';
import { 
  AlertTriangle, Zap, Waves, ShieldAlert, CheckCircle2, 
  MapPin, Camera, X, ArrowRight, User, Phone, Check, Clock
} from 'lucide-react';

interface ReportHazardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: Omit<HazardReport, 'id' | 'reportedAt' | 'status'>) => void;
  initialCoords?: { lat: number; lng: number } | null;
  onStartPickLocation: () => void;
}

export const ReportHazardModal: React.FC<ReportHazardModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  initialCoords,
  onStartPickLocation
}) => {
  const [reportType, setReportType] = useState<'flood' | 'electric' | 'road' | 'surveillance' | 'other'>('flood');
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState(initialCoords ? initialCoords.lat : 15.1930);
  const [lng, setLng] = useState(initialCoords ? initialCoords.lng : 104.8650);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('high');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [selectedSampleImage, setSelectedSampleImage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Update coords if initialCoords changed
  React.useEffect(() => {
    if (initialCoords) {
      setLat(initialCoords.lat);
      setLng(initialCoords.lng);
      setLocationName(`พิกัด ${initialCoords.lat.toFixed(4)}, ${initialCoords.lng.toFixed(4)} (เลือกจากแผนที่)`);
    }
  }, [initialCoords]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let category: RiskPinCategory = 'flood_zone';
    if (reportType === 'electric') category = 'electric_hazard';
    if (reportType === 'road') category = 'road_closure';
    if (reportType === 'surveillance') category = 'flood_zone';
    if (reportType === 'other') category = 'flood_zone';

    onSubmitReport({
      reportType,
      title: title.trim() || `รายงานจุดเสี่ยง: ${locationName || 'ชุมชนหาดสวนยา'}`,
      category,
      riskLevel,
      description: description.trim(),
      locationName: locationName.trim() || 'ชุมชนหาดสวนยา วารินชำราบ',
      lat: Number(lat),
      lng: Number(lng),
      reporterName: reporterName.trim() || 'ประชาชนในพื้นที่',
      reporterPhone: reporterPhone.trim() || '08X-XXX-XXXX',
      imageUrl: selectedSampleImage || undefined
    });

    setSubmittedSuccess(true);
  };

  const handleReset = () => {
    setSubmittedSuccess(false);
    setTitle('');
    setLocationName('');
    setDescription('');
    setSelectedSampleImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-300 font-medium mb-0.5">
              ระบบมีส่วนร่วมของประชาชน (Citizen Hazard Reporting)
            </div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              พบจุดเสี่ยง? แจ้งเรา
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Flow Banner (From Document Page 6) */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            ขั้นตอนการทำงาน 4 ขั้นตอน:
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-1.5 bg-blue-50 border border-blue-200 rounded text-blue-900 font-medium">
              1. แจ้งข้อมูล
            </div>
            <div className="p-1.5 bg-slate-100 rounded text-slate-600">
              2. ตรวจสอบ
            </div>
            <div className="p-1.5 bg-slate-100 rounded text-slate-600">
              3. อนุมัติขึ้นแผนที่
            </div>
            <div className="p-1.5 bg-slate-100 rounded text-slate-600">
              4. แจ้งเตือนทุกคน
            </div>
          </div>
        </div>

        {/* Form Body or Success Confirmation */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              ส่งข้อมูลจุดเสี่ยงเรียบร้อยแล้ว!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              ข้อมูลของท่านถูกส่งเข้าสู่ระบบศูนย์ปฏิบัติการเพื่อรอเจ้าหน้าที่ฝ่ายบรรเทาสาธารณภัย เทศบาลเมืองวารินชำราบ หรือ กฟภ. ทำการยืนยันความถูกต้อง ก่อนปรับปรุงขึ้นสู่แผนที่สด
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 text-slate-600 max-w-sm mx-auto">
              <div><strong>ประเภท:</strong> {reportType === 'electric' ? 'จุดเสี่ยงไฟฟ้า' : reportType === 'flood' ? 'จุดน้ำท่วมสูง' : 'ถนนสัญจรไม่ได้'}</div>
              <div><strong>สถานที่:</strong> {locationName || 'ชุมชนหาดสวนยา'}</div>
              <div><strong>สถานะ:</strong> <span className="text-amber-600 font-semibold">รอเจ้าหน้าที่ตรวจสอบ (Pending)</span></div>
            </div>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                ปิดหน้าต่างและกลับสู่แผนที่
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Category selection (From Document Page 6: 5 ประเภท) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                1. เลือกประเภทจุดเสี่ยงที่พบ *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'flood', label: '1) จุดน้ำท่วมสูง', icon: Waves },
                  { id: 'electric', label: '2) เสี่ยงจากไฟฟ้า', icon: Zap },
                  { id: 'road', label: '3) ถนนผ่านไม่ได้', icon: AlertTriangle },
                  { id: 'surveillance', label: '4) เหตุควรเฝ้าระวัง', icon: ShieldAlert },
                  { id: 'other', label: '5) จุดเสี่ยงอื่นๆ', icon: MapPin },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setReportType(item.id as any)}
                      className={`p-2.5 rounded-lg border text-left text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                        reportType === item.id
                          ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${reportType === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location & Map coordinate picker */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  2. บริเวณหรือสถานที่เกิดเหตุ *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartPickLocation();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>จิ้มตำแหน่งบนแผนที่</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="เช่น ท้ายซอยหาดสวนยา 3, ใต้สะพานเสรีประชาธิปไตย, หน้าศาลาชุมชน"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span>พิกัด: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
              </div>
            </div>

            {/* Title / Short description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                3. หัวข้อหรือลักษณะสถานการณ์ *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="เช่น สายไฟหย่อนจมน้ำ, ถนนมีน้ำท่วมลึก 50 ซม. รถเล็กผ่านไม่ได้"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                4. ประเมินระดับความเสี่ยงเบื้องต้น (ตามระบบ 3 สี)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { level: 'high', label: 'สีแดง (ระดับสูง)', desc: 'อันตรายมาก ห้ามผ่าน/ตัดไฟด่วน' },
                  { level: 'medium', label: 'สีเหลือง (ปานกลาง)', desc: 'ควรระมัดระวังเป็นพิเศษ' },
                  { level: 'low', label: 'สีเขียว (ระดับต่ำ)', desc: 'น้ำท่วมเล็กน้อย ยังสัญจรได้' },
                ].map(r => (
                  <button
                    type="button"
                    key={r.level}
                    onClick={() => setRiskLevel(r.level as any)}
                    className={`p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                      riskLevel === r.level
                        ? r.level === 'high'
                          ? 'bg-red-50 border-red-500 text-red-900'
                          : r.level === 'medium'
                          ? 'bg-amber-50 border-amber-500 text-amber-900'
                          : 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">{r.label}</div>
                    <div className="text-[10px] text-slate-500">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                5. รายละเอียดเพิ่มเติม
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="ระบุความลึกของน้ำ กระแสน้ำ สภาพเสาไฟ หรือบุคคลที่ต้องการความช่วยเหลือเร่งด่วน..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sample Photo Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>6. ภาพประกอบเหตุการณ์จริง</span>
                <span className="text-[11px] text-slate-500 font-normal">เลือกภาพตัวอย่างจากพื้นที่</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { url: electricImg, label: 'เสาไฟฟ้าใกล้ผิวน้ำ' },
                  { url: droneImg, label: 'ถนนริมน้ำมูลท่วมสูง' },
                  { url: rescueImg, label: 'เรือกู้ภัยสัญจร' },
                ].map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedSampleImage(selectedSampleImage === img.url ? null : img.url)}
                    className={`relative rounded-lg overflow-hidden border-2 text-left cursor-pointer transition-all ${
                      selectedSampleImage === img.url ? 'border-blue-600 ring-2 ring-blue-500' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.label} 
                      referrerPolicy="no-referrer"
                      className="w-full h-16 object-cover" 
                    />
                    <div className="p-1 bg-white text-[10px] truncate text-slate-700 font-medium">
                      {img.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reporter Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  ชื่อ-สกุล ผู้แจ้ง
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                  placeholder="เช่น นายสมชาย ประชาชน"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  เบอร์โทรศัพท์ติดต่อกลับ
                </label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={e => setReporterPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX (สำหรับยืนยันเหตุ)"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                ส่งข้อมูลแจ้งจุดเสี่ยง
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { HazardReport } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, Clock, MapPin, User, Phone, AlertTriangle, FileText, Check } from 'lucide-react';

interface OfficerVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: HazardReport[];
  onApproveReport: (id: string, adminNote: string, verifiedBy: string) => void;
  onRejectReport: (id: string, reason: string) => void;
}

export const OfficerVerifyModal: React.FC<OfficerVerifyModalProps> = ({
  isOpen,
  onClose,
  reports,
  onApproveReport,
  onRejectReport
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [officerName, setOfficerName] = useState('นายช่างชัชวาล (กฟภ. วารินชำราบ / ปภ.เทศบาลฯ)');
  const [adminNote, setAdminNote] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');

  if (!isOpen) return null;

  const currentReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const filteredReports = reports.filter(r => {
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'approved') return r.status === 'approved';
    return true;
  });

  const handleApprove = () => {
    if (!currentReport) return;
    onApproveReport(
      currentReport.id, 
      adminNote || 'ตรวจสอบความถูกต้องและผ่านการยืนยันจากศูนย์ปฏิบัติการส่วนหน้าเรียบร้อย', 
      officerName
    );
    setAdminNote('');
  };

  const handleReject = () => {
    if (!currentReport) return;
    onRejectReport(currentReport.id, adminNote || 'ข้อมูลซ้ำซ้อนหรือระดับน้ำลดลงสู่สภาวะปกติแล้ว');
    setAdminNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-300 font-medium">ศูนย์ปฏิบัติการส่วนหน้า / คณะทำงานบริหารจัดการความเสี่ยง</div>
              <h2 className="text-base sm:text-lg font-bold">
                ระบบตรวจสอบและยืนยันข้อมูลจุดเสี่ยง (Officer Verification Portal)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Sub-header / Tabs */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              รอการตรวจสอบ ({reports.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              อนุมัติขึ้นแผนที่แล้ว ({reports.filter(r => r.status === 'approved').length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              ทั้งหมด ({reports.length})
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            เชื่อมต่อ: เทศบาลวารินชำราบ · กฟภ. · ชรบ.หาดสวนยา
          </div>
        </div>

        {/* Modal Main Body (Split 2-Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Left List of Reports */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                ไม่มีรายงานในหมวดนี้
              </div>
            ) : (
              filteredReports.map(rep => {
                const isSelected = rep.id === (currentReport?.id || '');
                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        rep.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status === 'approved' ? 'อนุมัติแล้ว' : rep.status === 'rejected' ? 'ปฏิเสธ' : 'รอตรวจสอบ'}
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {rep.reportedAt}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                      {rep.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{rep.locationName}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Detail & Action Panel */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-4">
            {currentReport ? (
              <>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span>ประเภท: {currentReport.reportType === 'electric' ? 'เสี่ยงไฟฟ้า' : currentReport.reportType === 'flood' ? 'น้ำท่วมสูง' : 'ถนนผ่านไม่ได้'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-red-600">
                        {currentReport.riskLevel === 'high' ? 'ความเสี่ยงสูง (สีแดง)' : 'ความเสี่ยงปานกลาง'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {currentReport.title}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    currentReport.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    currentReport.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {currentReport.status === 'approved' ? 'อนุมัติขึ้นแผนที่แล้ว' : currentReport.status === 'rejected' ? 'ปฏิเสธ' : 'รอเจ้าหน้าที่ลงความเห็น'}
                  </span>
                </div>

                {/* Photo Preview if any */}
                {currentReport.imageUrl && (
                  <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200">
                    <img 
                      src={currentReport.imageUrl} 
                      alt={currentReport.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded">
                      ภาพแนบจากผู้แจ้ง
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-1">รายละเอียดจากประชาชน:</div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed">
                    {currentReport.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                  </div>
                </div>

                {/* Reporter Metadata */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">ผู้แจ้งเหตุ</div>
                      <div className="font-medium text-slate-800">{currentReport.reporterName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">เบอร์โทรศัพท์</div>
                      <div className="font-medium text-slate-800">{currentReport.reporterPhone}</div>
                    </div>
                  </div>
                </div>

                {/* Verification Actions Form */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    บันทึกการตรวจสอบโดยเจ้าหน้าที่
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">เจ้าหน้าที่ผู้ลงตรวจ:</label>
                    <input
                      type="text"
                      value={officerName}
                      onChange={e => setOfficerName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">หมายเหตุคำสั่งการ / ข้อความแจ้งเตือนประชาชน:</label>
                    <textarea
                      rows={2}
                      value={adminNote}
                      onChange={e => setAdminNote(e.target.value)}
                      placeholder="เช่น ชุดปฏิบัติการทางน้ำเข้าตรวจสอบแล้ว น้ำลึก 60 ซม. ได้กั้นเชือกเตือนและตัดไฟจุดดังกล่าวแล้ว"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {currentReport.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={handleReject}
                        className="px-4 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        ปฏิเสธคำขอ
                      </button>
                      <button
                        onClick={handleApprove}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        อนุมัติและนำขึ้นแสดงบนแผนที่
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>รายงานนี้ได้รับการยืนยันและกำลังแสดงผลบนแผนที่สด</span>
                      </div>
                      <span className="text-[10px] text-emerald-600">โดย: {currentReport.verifiedBy}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-sm">
                กรุณาเลือกรายการทางซ้ายมือเพื่อตรวจสอบ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

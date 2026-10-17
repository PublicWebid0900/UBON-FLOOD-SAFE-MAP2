import React from 'react';
import { History, X, AlertTriangle, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';

interface FloodHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloodHistoryModal: React.FC<FloodHistoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-300 font-medium">บันทึกประวัติศาสตร์อุทกภัยภาคอีสาน</div>
              <h2 className="text-lg font-bold">
                ภาพน้ำท่วมเมื่อปี 2562 ในพื้นที่หาดสวนยา จังหวัดอุบลราชธานี
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Main Visual: Drone & Ground Archive */}
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
              <img 
                src="/src/assets/images/ubon_flood_hatsuanya_drone_1792241312972.jpg" 
                alt="ภาพถ่ายทางอากาศน้ำท่วมชุมชนหาดสวนยา ปี 2562 และสะพานเสรีประชาธิปไตย"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-xs">
                <span className="font-semibold">ภาพถ่ายทางอากาศ (Drone Perspective):</span> ชุมชนหาดสวนยา ริมแม่น้ำมูล อ.วารินชำราบ จ.อุบลราชธานี ระดับน้ำท่วมหลังคาบ้านเรือนและสะพานเสรีประชาธิปไตย
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-slate-200 relative">
                <img 
                  src="/src/assets/images/ubon_flood_rescue_operations_1792241313877.jpg" 
                  alt="เรือกู้ภัยส่งเสบียงหาดสวนยา"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
                <div className="p-2.5 bg-slate-50 text-xs border-t border-slate-200">
                  <div className="font-bold text-slate-900">การเข้าช่วยเหลือผู้ประสบภัยทางเรือ</div>
                  <div className="text-slate-500 text-[11px]">การเดินทางในชุมชนต้องใช้เรือกู้ภัยท้องแบนเท่านั้น</div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 relative">
                <img 
                  src="/src/assets/images/ubon_flood_electrical_safety_1792241315162.jpg" 
                  alt="การตรวจสอบระบบไฟฟ้าช่วงน้ำท่วม"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
                <div className="p-2.5 bg-slate-50 text-xs border-t border-slate-200">
                  <div className="font-bold text-slate-900">จุดเสี่ยงจากเสาและอุปกรณ์ไฟฟ้า</div>
                  <div className="text-slate-500 text-[11px]">อันตรายจากไฟฟ้ารั่วที่สร้างความหวาดกลัวแก่ประชาชน</div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Narrative & Retrospective */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>กันยายน 2562 (อิทธิพลพายุโซนร้อน "โพดุล" และพายุดีเปรสชัน "คาจิกิ")</span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              บทเรียนจากมหาอุทกภัยปี 2562 สู่แรงบันดาลใจนวัตกรรมแผนที่ดิจิทัล
            </h3>

            <p className="leading-relaxed text-xs sm:text-sm text-slate-600">
              เมื่อปี พ.ศ. 2562 จังหวัดอุบลราชธานีต้องเผชิญกับอุทกภัยครั้งรุนแรงที่สุดในรอบเกือบสองทศวรรษ โดยระดับน้ำแม่น้ำมูลที่สถานี M.7 สะพานเสรีประชาธิปไตย พุ่งสูงขึ้นถึง <strong className="text-slate-900">10.97 เมตร</strong> สูงกว่าระดับตลิ่งถึง 3.97 เมตร ส่งผลให้ชุมชนบ้านหาดสวนยาซึ่งตั้งอยู่ติดริมแม่น้ำมูลถูกน้ำท่วมมิดทั้งชุมชน ประชาชนจำต้องอพยพอย่างกะทันหัน
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                ปัญหาและอุปสรรคสำคัญที่เกิดขึ้นในเหตุการณ์ปี 2562:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                <li>ประชาชนไม่มีข้อมูลจุดเสี่ยงล่วงหน้า ไม่ทราบว่าถนนใดรถผ่านได้หรือไม่ได้</li>
                <li>ความหวาดกลัวเรื่องไฟฟ้ารั่วและไฟฟ้าดูด ทำให้การสัญจรและการช่วยเหลือติดขัด</li>
                <li>ความกังวลเรื่องการลักขโมยทรัพย์สินในบ้านเรือนที่ถูกทิ้งร้างช่วงอพยพ</li>
                <li>ผู้ป่วยติดเตียงและกลุ่มเปราะบางได้รับการช่วยเหลือล่าช้า เนื่องจากไม่มีฐานข้อมูลพิกัดที่แม่นยำ</li>
              </ul>
            </div>

            <p className="leading-relaxed text-xs sm:text-sm text-slate-600">
              ด้วยเหตุนี้ คณะนักศึกษาคณะรัฐศาสตร์ มหาวิทยาลัยอุบลราชธานี จึงได้พัฒนา <strong className="text-slate-900">UBON FLOOD SAFE MAP</strong> ขึ้นมา เพื่อเปลี่ยนจากการ "รอให้เกิดเหตุแล้วจึงแก้ไข" มาสู่การ "รู้จุดเสี่ยงล่วงหน้า เตือนประชาชน และเตรียมการรับมือ" อย่างเป็นระบบ
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

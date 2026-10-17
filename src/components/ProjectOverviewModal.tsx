import React from 'react';
import { PROJECT_DETAILS, PROJECT_STUDENTS } from '../data/mockData';
import { BookOpen, Users, CheckCircle, GraduationCap, X, Award, ShieldCheck, Layers } from 'lucide-react';

interface ProjectOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectOverviewModal: React.FC<ProjectOverviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-300 font-medium">{PROJECT_DETAILS.faculty}</div>
              <h2 className="text-base sm:text-lg font-bold">
                ข้อมูลโครงงานนวัตกรรม UBON FLOOD SAFE MAP
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Academic Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{PROJECT_DETAILS.course}</span>
              <span aria-hidden="true">·</span>
              <span>{PROJECT_DETAILS.semester}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {PROJECT_DETAILS.title}
            </h3>
            <p className="text-xs text-slate-600">
              พื้นที่ศึกษา: <strong>{PROJECT_DETAILS.community}</strong>
            </p>
            <div className="text-xs text-blue-700 font-medium pt-1">
              เสนอ: <strong>{PROJECT_DETAILS.advisor}</strong>
            </div>
          </div>

          {/* Philosophy */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              หัวใจสำคัญและปรัชญาของนวัตกรรม
            </h4>
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950 font-medium leading-relaxed text-xs sm:text-sm">
              "{PROJECT_DETAILS.corePhilosophy}"
            </div>
          </div>

          {/* 8 Steps of Innovation (Page 8 in document) */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              กระบวนการทำงานของนวัตกรรม 8 ขั้นตอน (Innovation Lifecycle)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_DETAILS.innovationSteps.map((step) => (
                <div key={step.step} className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{step.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 7 Key Strengths */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              จุดเด่นสำคัญของ UBON FLOOD SAFE MAP
            </h4>
            <div className="space-y-1.5">
              {PROJECT_DETAILS.keyStrengths.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members List (9 Students) */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              คณะผู้จัดทำโครงงาน (นักศึกษาคณะรัฐศาสตร์ มหาวิทยาลัยอุบลราชธานี)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PROJECT_STUDENTS.map((student, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-xs text-slate-900">{student.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono tabular-nums">รหัสนักศึกษา: {student.studentId}</div>
                  <div className="text-[10px] text-blue-600 mt-0.5">{student.role}</div>
                </div>
              ))}
            </div>
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

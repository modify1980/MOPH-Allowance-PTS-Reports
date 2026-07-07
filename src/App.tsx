/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Officer } from "./types";
import OfficerList from "./components/OfficerList";
import OfficerForm from "./components/OfficerForm";
import ReportPreview from "./components/ReportPreview";
import AppsScriptExport from "./components/AppsScriptExport";
import { Users, FileText, UserPlus, CreditCard, Heart, ClipboardCheck, Sparkles, FileCode } from "lucide-react";

// Pre-seeded sample data matching the exact templates submitted by the user
const SAMPLE_OFFICERS: Officer[] = [
  {
    id: "thanwit-kamtha",
    title: "นาย",
    firstName: "ธันญ์นวิชญ์",
    lastName: "คำทา",
    position: "นักเทคนิคการแพทย์ชำนาญการ",
    workplace: "สมเด็จพระยุพราชเดชอุดม",
    province: "อุบลราชธานี",
    gisLevel: "s",
    address: {
      houseNo: "67",
      moo: "4",
      subdistrict: "บ้านกอก",
      district: "เขื่องใน",
      province: "อุบลราชธานี"
    },
    allowanceRate: 2800,
    ptsRate: 1000,
    fundSourceAllowance: "เงินบำรุงโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
    fundSourcePts: "เงินงบประมาณโรงพยาบาลสมเด็จพระยุพราชเดชอุดม",
    workHistories: [
      {
        id: "hist-1",
        workplace: "สมเด็จพระยุพราชเดชอุดม",
        province: "อุบลราชธานี",
        startDate: "2004-05-11", // 11 พฤษภาคม 2547
        endDate: "current"
      }
    ]
  }
];

export default function App() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [activeView, setActiveView] = useState<"list" | "form" | "preview" | "export">("list");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);

  // Load from local storage or pre-seed
  useEffect(() => {
    const saved = localStorage.getItem("moph_officers");
    if (saved) {
      try {
        setOfficers(JSON.parse(saved));
      } catch (e) {
        setOfficers(SAMPLE_OFFICERS);
      }
    } else {
      setOfficers(SAMPLE_OFFICERS);
      localStorage.setItem("moph_officers", JSON.stringify(SAMPLE_OFFICERS));
    }
  }, []);

  const saveOfficers = (updatedOfficers: Officer[]) => {
    setOfficers(updatedOfficers);
    localStorage.setItem("moph_officers", JSON.stringify(updatedOfficers));
  };

  const handleSaveOfficer = (officer: Officer) => {
    let updated: Officer[];
    if (editingOfficer) {
      // Edit mode
      updated = officers.map(o => o.id === officer.id ? officer : o);
    } else {
      // Add mode
      updated = [...officers, officer];
    }
    saveOfficers(updated);
    setEditingOfficer(null);
    setActiveView("list");
  };

  const handleDeleteOfficer = (id: string) => {
    if (confirm("ยืนยันการลบรายชื่อบุคลากรรายนี้ออกจากฐานข้อมูล?")) {
      const updated = officers.filter(o => o.id !== id);
      saveOfficers(updated);
    }
  };

  const handleEditOfficer = (officer: Officer) => {
    setEditingOfficer(officer);
    setActiveView("form");
  };

  const handleSelectOfficer = (officer: Officer) => {
    setSelectedOfficer(officer);
    setActiveView("preview");
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50/70 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Upper Navigation Header (hidden on print) */}
      <header className="no-print bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700 rounded-xl text-white shadow-md shadow-emerald-700/10">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">MOPH Allowance & PTS Reports</h1>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  พ.ศ. 2566
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">ระบบจัดทำเอกสารเบี้ยเลี้ยงเหมาจ่าย และ ค่าตอบแทน พ.ต.ส. ประจำเดือน</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView("export");
                setSelectedOfficer(null);
                setEditingOfficer(null);
              }}
              className="bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <FileCode className="w-4 h-4 text-indigo-600" />
              โค้ด Google Apps Script 💾
            </button>

            <button
              onClick={() => {
                setEditingOfficer(null);
                setActiveView("form");
              }}
              className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              เพิ่มบุคลากรใหม่
            </button>
            
            <button
              onClick={() => {
                setActiveView("list");
                setSelectedOfficer(null);
                setEditingOfficer(null);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              ทำเนียบบุคลากร
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === "list" && (
          <div className="space-y-6">
            {/* Quick Banner Alert */}
            <div className="bg-gradient-to-r from-teal-850 to-emerald-800 text-white rounded-2xl p-6 shadow-md shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="space-y-2 relative z-10">
                <h2 className="text-xl font-bold font-sans flex items-center gap-2">
                  <ClipboardCheck className="w-6 h-6 text-emerald-300" />
                  โปรแกรมพิมพ์เบี้ยเลี้ยงเหมาจ่ายและเงิน พ.ต.ส.
                </h2>
                <p className="text-sm text-emerald-100/90 max-w-xl">
                  หมดปัญหาการคำนวณวันสะสมและกรอกแบบฟอร์มแบบเดิม ระบบจะคำนวณอายุราชการ
                  แปลจำนวนเงินเป็นภาษาไทยให้อัตโนมัติ พร้อมส่งออกทางเครื่องพิมพ์หรือเซฟเป็นไฟล์ PDF ได้ทันที
                </p>
              </div>
              <div className="relative z-10 shrink-0">
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-xs space-y-1 text-emerald-50">
                  <p>✔ ระบบคำนวณอายุงานอัตโนมัติ</p>
                  <p>✔ ออกแบบเอกสารแบบร่างราชการ</p>
                  <p>✔ ปรับเลขไทย/อารบิกได้เพียงปุ่มเดียว</p>
                </div>
              </div>
              {/* Decorative graphic background lines */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.4),transparent)] pointer-events-none"></div>
            </div>

            <OfficerList
              officers={officers}
              onSelect={handleSelectOfficer}
              onEdit={handleEditOfficer}
              onDelete={handleDeleteOfficer}
              onAddNew={() => {
                setEditingOfficer(null);
                setActiveView("form");
              }}
            />
          </div>
        )}

        {activeView === "form" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView("list")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2"
              >
                ← กลับสู่หน้ารายชื่อ
              </button>
            </div>
            <OfficerForm
              initialOfficer={editingOfficer || undefined}
              onSave={handleSaveOfficer}
              onCancel={() => {
                setEditingOfficer(null);
                setActiveView("list");
              }}
            />
          </div>
        )}

        {activeView === "preview" && selectedOfficer && (
          <div className="space-y-4">
            <ReportPreview
              officer={selectedOfficer}
              onBack={() => {
                setSelectedOfficer(null);
                setActiveView("list");
              }}
            />
          </div>
        )}

        {activeView === "export" && (
          <div className="space-y-4 animate-in fade-in duration-250">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView("list")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2"
              >
                ← กลับสู่หน้ารายชื่อ
              </button>
            </div>
            <AppsScriptExport />
          </div>
        )}
      </main>

      {/* Footer (hidden on print) */}
      <footer className="no-print bg-white border-t border-slate-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span>© 2026 ระบบจัดเตรียมใบเบิกสาธารณสุข - กระทรวงสาธารณสุข</span>
          </div>
          <div className="flex items-center gap-3">
            <span>ปรับปรุงตามเกณฑ์ประกาศเบี้ยเลี้ยงปี พ.ศ. 2566 และ พ.ต.ส.</span>
            <span>•</span>
            <span className="font-semibold text-slate-500">เวอร์ชัน 1.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

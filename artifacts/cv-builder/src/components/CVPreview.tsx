import { useCVContext } from "@/context/CVContext";
import { CVData } from "@/types/cv";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

// ─── Shared empty state ──────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20 text-muted-foreground">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium">ستظهر معاينة السيرة الذاتية هنا</p>
      <p className="text-xs mt-1">ابدأ بإدخال بياناتك في النموذج</p>
    </div>
  );
}

// ─── Template 1: ATS Classic ──────────────────────────────────────────────────
function ATSTemplate({ d }: { d: CVData }) {
  const { personalInfo: p, education, experience, skills, courses, languages } = d;
  return (
    <div id="cv-preview" style={{ fontFamily: "'Segoe UI','Noto Sans Arabic',Arial,sans-serif", direction: "rtl", minHeight: "297mm", padding: "12mm 14mm", background: "#fff", color: "#1a1a1a" }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #111", paddingBottom: 14, marginBottom: 4 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#000" }}>{p.fullName}</div>
        {p.jobTitle && <div style={{ fontSize: 11, fontWeight: 600, color: "#555", marginTop: 3 }}>{p.jobTitle}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 12px", marginTop: 6 }}>
          {p.email && <span style={{ fontSize: 9.5, color: "#555", display: "flex", alignItems: "center", gap: 3 }}><Mail className="w-2.5 h-2.5" />{p.email}</span>}
          {p.phone && <span style={{ fontSize: 9.5, color: "#555", display: "flex", alignItems: "center", gap: 3 }}><Phone className="w-2.5 h-2.5" />{p.phone}</span>}
          {p.location && <span style={{ fontSize: 9.5, color: "#555", display: "flex", alignItems: "center", gap: 3 }}><MapPin className="w-2.5 h-2.5" />{p.location}</span>}
          {p.linkedin && <span style={{ fontSize: 9.5, color: "#555", display: "flex", alignItems: "center", gap: 3 }}><Linkedin className="w-2.5 h-2.5" />{p.linkedin}</span>}
          {p.website && <span style={{ fontSize: 9.5, color: "#555", display: "flex", alignItems: "center", gap: 3 }}><Globe className="w-2.5 h-2.5" />{p.website}</span>}
        </div>
      </div>
      {p.summary && <Section title="الملخص المهني"><p style={{ fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{p.summary}</p></Section>}
      {experience.length > 0 && <Section title="الخبرات العملية">{experience.map(e => (
        <div key={e.id} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 11, fontWeight: 700 }}>{e.jobTitle}</div><div style={{ fontSize: 10, color: "#555", fontWeight: 600 }}>{e.company}{e.location ? ` · ${e.location}` : ""}</div></div>
            <div style={{ fontSize: 9.5, color: "#777", whiteSpace: "nowrap" }}>{e.startDate}{(e.startDate || e.endDate) && " – "}{e.current ? "حتى الآن" : e.endDate}</div>
          </div>
          {e.description && <div style={{ fontSize: 10, color: "#444", marginTop: 3, whiteSpace: "pre-line" }}>{e.description}</div>}
        </div>
      ))}</Section>}
      {education.length > 0 && <Section title="المؤهلات العلمية">{education.map(e => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div><div style={{ fontSize: 11, fontWeight: 700 }}>{e.degree}{e.field ? ` في ${e.field}` : ""}</div><div style={{ fontSize: 10, color: "#555" }}>{e.institution}{e.gpa ? ` · المعدل: ${e.gpa}` : ""}</div></div>
          {e.endDate && <div style={{ fontSize: 9.5, color: "#777", whiteSpace: "nowrap" }}>{e.endDate}</div>}
        </div>
      ))}</Section>}
      {skills.length > 0 && <Section title="المهارات"><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map(s => <span key={s.id} style={{ fontSize: 9.5, background: "#f0f0f0", border: "1px solid #ddd", borderRadius: 4, padding: "2px 10px" }}>{s.name}</span>)}</div></Section>}
      {languages.length > 0 && <Section title="اللغات"><div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{languages.map(l => <span key={l.id} style={{ fontSize: 10 }}><strong>{l.name}</strong>{l.level ? ` · ${l.level}` : ""}</span>)}</div></Section>}
      {courses.length > 0 && <Section title="الدورات والشهادات">{courses.map(c => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <div><div style={{ fontSize: 10.5, fontWeight: 600 }}>{c.name}</div>{c.provider && <div style={{ fontSize: 9.5, color: "#777" }}>{c.provider}{c.certificateId ? ` · ${c.certificateId}` : ""}</div>}</div>
          {c.date && <div style={{ fontSize: 9.5, color: "#777" }}>{c.date}</div>}
        </div>
      ))}</Section>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, whiteSpace: "nowrap" }}>{title}</span>
        <div style={{ flex: 1, height: 1.5, background: "#ccc" }} />
      </div>
      {children}
    </div>
  );
}

// ─── Template 2: Modern ────────────────────────────────────────────────────────
function ModernTemplate({ d }: { d: CVData }) {
  const { personalInfo: p, education, experience, skills, courses, languages } = d;
  const sec = (title: string, children: React.ReactNode) => (
    <div style={{ marginTop: 12 }}>
      <div style={{ borderRight: "3px solid #111", paddingRight: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#000" }}>{title}</span>
      </div>
      {children}
    </div>
  );
  return (
    <div id="cv-preview" style={{ fontFamily: "'Segoe UI','Noto Sans Arabic',Arial,sans-serif", direction: "rtl", minHeight: "297mm", padding: "12mm 14mm", background: "#fff", color: "#1a1a1a" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#000", letterSpacing: -0.5 }}>{p.fullName}</div>
        {p.jobTitle && <div style={{ fontSize: 11.5, fontWeight: 600, color: "#444", marginTop: 2 }}>{p.jobTitle}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 14px", marginTop: 6 }}>
          {p.email && <span style={{ fontSize: 9.5, color: "#555" }}>✉ {p.email}</span>}
          {p.phone && <span style={{ fontSize: 9.5, color: "#555" }}>📞 {p.phone}</span>}
          {p.location && <span style={{ fontSize: 9.5, color: "#555" }}>📍 {p.location}</span>}
          {p.linkedin && <span style={{ fontSize: 9.5, color: "#555" }}>🔗 {p.linkedin}</span>}
          {p.website && <span style={{ fontSize: 9.5, color: "#555" }}>🌐 {p.website}</span>}
        </div>
        <div style={{ height: 2, background: "#000", marginTop: 10 }} />
      </div>
      {p.summary && sec("الملخص المهني", <p style={{ fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{p.summary}</p>)}
      {experience.length > 0 && sec("الخبرات العملية", experience.map(e => (
        <div key={e.id} style={{ marginBottom: 8, paddingRight: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 11, fontWeight: 700 }}>{e.jobTitle}</div><div style={{ fontSize: 10, color: "#555" }}>{e.company}{e.location ? ` · ${e.location}` : ""}</div></div>
            <div style={{ fontSize: 9.5, color: "#777", whiteSpace: "nowrap", background: "#f5f5f5", padding: "2px 8px", borderRadius: 12, alignSelf: "flex-start" }}>{e.startDate}{(e.startDate || e.endDate) && " – "}{e.current ? "حتى الآن" : e.endDate}</div>
          </div>
          {e.description && <div style={{ fontSize: 10, color: "#444", marginTop: 3, whiteSpace: "pre-line" }}>{e.description}</div>}
        </div>
      )))}
      {education.length > 0 && sec("المؤهلات العلمية", education.map(e => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, paddingRight: 8 }}>
          <div><div style={{ fontSize: 11, fontWeight: 700 }}>{e.degree}{e.field ? ` في ${e.field}` : ""}</div><div style={{ fontSize: 10, color: "#555" }}>{e.institution}{e.gpa ? ` · المعدل: ${e.gpa}` : ""}</div></div>
          {e.endDate && <div style={{ fontSize: 9.5, color: "#777", background: "#f5f5f5", padding: "2px 8px", borderRadius: 12 }}>{e.endDate}</div>}
        </div>
      )))}
      {skills.length > 0 && sec("المهارات", <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingRight: 8 }}>{skills.map(s => <span key={s.id} style={{ fontSize: 9.5, background: "#111", color: "#fff", borderRadius: 4, padding: "2px 10px" }}>{s.name}</span>)}</div>)}
      {languages.length > 0 && sec("اللغات", <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingRight: 8 }}>{languages.map(l => <span key={l.id} style={{ fontSize: 10 }}><strong>{l.name}</strong>{l.level ? ` · ${l.level}` : ""}</span>)}</div>)}
      {courses.length > 0 && sec("الدورات والشهادات", courses.map(c => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, paddingRight: 8 }}>
          <div><div style={{ fontSize: 10.5, fontWeight: 600 }}>{c.name}</div>{c.provider && <div style={{ fontSize: 9.5, color: "#777" }}>{c.provider}</div>}</div>
          {c.date && <div style={{ fontSize: 9.5, color: "#777" }}>{c.date}</div>}
        </div>
      )))}
    </div>
  );
}

// ─── Template 3: Corporate ─────────────────────────────────────────────────────
function CorporateTemplate({ d }: { d: CVData }) {
  const { personalInfo: p, education, experience, skills, courses, languages } = d;
  const sec = (title: string, children: React.ReactNode) => (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 10.5, fontWeight: 800, color: "#000", textTransform: "uppercase", letterSpacing: 2, borderBottom: "2px solid #000", paddingBottom: 3, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
  return (
    <div id="cv-preview" style={{ fontFamily: "'Segoe UI','Noto Sans Arabic',Arial,sans-serif", direction: "rtl", minHeight: "297mm", background: "#fff", color: "#1a1a1a" }}>
      {/* Dark header */}
      <div style={{ background: "#111", color: "#fff", padding: "16px 14mm", marginBottom: 2 }}>
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>{p.fullName}</div>
        {p.jobTitle && <div style={{ fontSize: 11, color: "#ccc", marginTop: 4, fontWeight: 500 }}>{p.jobTitle}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: 10 }}>
          {p.email && <span style={{ fontSize: 9, color: "#bbb" }}>✉ {p.email}</span>}
          {p.phone && <span style={{ fontSize: 9, color: "#bbb" }}>📞 {p.phone}</span>}
          {p.location && <span style={{ fontSize: 9, color: "#bbb" }}>📍 {p.location}</span>}
          {p.linkedin && <span style={{ fontSize: 9, color: "#bbb" }}>🔗 {p.linkedin}</span>}
          {p.website && <span style={{ fontSize: 9, color: "#bbb" }}>🌐 {p.website}</span>}
        </div>
      </div>
      <div style={{ padding: "4px 14mm 14mm" }}>
        {p.summary && sec("الملخص المهني", <p style={{ fontSize: 10.5, color: "#444", lineHeight: 1.7 }}>{p.summary}</p>)}
        {experience.length > 0 && sec("الخبرات العملية", experience.map(e => (
          <div key={e.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 11, fontWeight: 700 }}>{e.jobTitle}</div><div style={{ fontSize: 10, color: "#555" }}>{e.company}{e.location ? ` · ${e.location}` : ""}</div></div>
              <div style={{ fontSize: 9.5, color: "#666", whiteSpace: "nowrap" }}>{e.startDate}{(e.startDate || e.endDate) && " – "}{e.current ? "حتى الآن" : e.endDate}</div>
            </div>
            {e.description && <div style={{ fontSize: 10, color: "#444", marginTop: 4, whiteSpace: "pre-line" }}>{e.description}</div>}
          </div>
        )))}
        {education.length > 0 && sec("المؤهلات العلمية", education.map(e => (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div><div style={{ fontSize: 11, fontWeight: 700 }}>{e.degree}{e.field ? ` في ${e.field}` : ""}</div><div style={{ fontSize: 10, color: "#555" }}>{e.institution}{e.gpa ? ` · المعدل: ${e.gpa}` : ""}</div></div>
            {e.endDate && <div style={{ fontSize: 9.5, color: "#777" }}>{e.endDate}</div>}
          </div>
        )))}
        {skills.length > 0 && sec("المهارات", <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map(s => <span key={s.id} style={{ fontSize: 9.5, border: "1.5px solid #111", borderRadius: 3, padding: "2px 10px", fontWeight: 500 }}>{s.name}</span>)}</div>)}
        {languages.length > 0 && sec("اللغات", <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{languages.map(l => <span key={l.id} style={{ fontSize: 10 }}><strong>{l.name}</strong>{l.level ? ` · ${l.level}` : ""}</span>)}</div>)}
        {courses.length > 0 && sec("الدورات والشهادات", courses.map(c => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <div><div style={{ fontSize: 10.5, fontWeight: 600 }}>{c.name}</div>{c.provider && <div style={{ fontSize: 9.5, color: "#777" }}>{c.provider}</div>}</div>
            {c.date && <div style={{ fontSize: 9.5, color: "#777" }}>{c.date}</div>}
          </div>
        )))}
      </div>
    </div>
  );
}

// ─── Template 4: Minimal ───────────────────────────────────────────────────────
function MinimalTemplate({ d }: { d: CVData }) {
  const { personalInfo: p, education, experience, skills, courses, languages } = d;
  const sec = (title: string, children: React.ReactNode) => (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#555", display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: 1.5, textTransform: "uppercase" }}>{title}</span>
      </div>
      {children}
    </div>
  );
  return (
    <div id="cv-preview" style={{ fontFamily: "'Segoe UI','Noto Sans Arabic',Arial,sans-serif", direction: "rtl", minHeight: "297mm", padding: "14mm 16mm", background: "#fff", color: "#1a1a1a" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#111", letterSpacing: -1 }}>{p.fullName}</div>
        {p.jobTitle && <div style={{ fontSize: 11, color: "#777", marginTop: 3, fontStyle: "italic" }}>{p.jobTitle}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 8, paddingTop: 8, borderTop: "1px dashed #ccc" }}>
          {p.email && <span style={{ fontSize: 9, color: "#666" }}>{p.email}</span>}
          {p.phone && <span style={{ fontSize: 9, color: "#666" }}>{p.phone}</span>}
          {p.location && <span style={{ fontSize: 9, color: "#666" }}>{p.location}</span>}
          {p.linkedin && <span style={{ fontSize: 9, color: "#666" }}>{p.linkedin}</span>}
          {p.website && <span style={{ fontSize: 9, color: "#666" }}>{p.website}</span>}
        </div>
      </div>
      {p.summary && sec("الملخص", <p style={{ fontSize: 10.5, color: "#444", lineHeight: 1.8 }}>{p.summary}</p>)}
      {experience.length > 0 && sec("الخبرات", experience.map(e => (
        <div key={e.id} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "#111" }}>{e.jobTitle}</div><div style={{ fontSize: 10, color: "#777" }}>{e.company}{e.location ? ` · ${e.location}` : ""}</div></div>
            <div style={{ fontSize: 9, color: "#999", whiteSpace: "nowrap", fontStyle: "italic" }}>{e.startDate}{(e.startDate || e.endDate) && " – "}{e.current ? "حتى الآن" : e.endDate}</div>
          </div>
          {e.description && <div style={{ fontSize: 10, color: "#555", marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.7 }}>{e.description}</div>}
        </div>
      )))}
      {education.length > 0 && sec("التعليم", education.map(e => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div><div style={{ fontSize: 11, fontWeight: 700 }}>{e.degree}{e.field ? ` في ${e.field}` : ""}</div><div style={{ fontSize: 10, color: "#777" }}>{e.institution}{e.gpa ? ` · المعدل: ${e.gpa}` : ""}</div></div>
          {e.endDate && <div style={{ fontSize: 9, color: "#999", fontStyle: "italic" }}>{e.endDate}</div>}
        </div>
      )))}
      {skills.length > 0 && sec("المهارات", <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{skills.map(s => <span key={s.id} style={{ fontSize: 9.5, background: "#f8f8f8", color: "#333", padding: "3px 12px", borderRadius: 20, border: "1px solid #e5e5e5" }}>{s.name}</span>)}</div>)}
      {languages.length > 0 && sec("اللغات", <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{languages.map(l => <span key={l.id} style={{ fontSize: 10, color: "#444" }}>{l.name}{l.level ? ` (${l.level})` : ""}</span>)}</div>)}
      {courses.length > 0 && sec("الدورات والشهادات", courses.map(c => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <div><div style={{ fontSize: 10.5 }}>{c.name}</div>{c.provider && <div style={{ fontSize: 9.5, color: "#999" }}>{c.provider}</div>}</div>
          {c.date && <div style={{ fontSize: 9, color: "#999", fontStyle: "italic" }}>{c.date}</div>}
        </div>
      )))}
    </div>
  );
}

// ─── Main CVPreview ────────────────────────────────────────────────────────────
export default function CVPreview() {
  const { cvData, selectedTemplate } = useCVContext();
  const { personalInfo, education, experience } = cvData;
  const hasContent = personalInfo.fullName || personalInfo.email || education.length > 0 || experience.length > 0;

  if (!hasContent) return <EmptyState />;

  switch (selectedTemplate) {
    case "modern":    return <ModernTemplate d={cvData} />;
    case "corporate": return <CorporateTemplate d={cvData} />;
    case "minimal":   return <MinimalTemplate d={cvData} />;
    default:          return <ATSTemplate d={cvData} />;
  }
}

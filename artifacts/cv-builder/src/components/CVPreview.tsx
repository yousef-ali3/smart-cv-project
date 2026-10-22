import type { CSSProperties, ReactNode } from "react";
import { useCVContext } from "@/context/CVContext";
import type { CVData } from "@/types/cv";

function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center py-20 text-center text-muted-foreground">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <svg className="h-8 w-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a2 2 0 01.707.293l5.414 5.414a2 2 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium">ستظهر معاينة السيرة الذاتية هنا</p>
      <p className="mt-1 text-xs">ابدأ بإدخال بياناتك في النموذج</p>
    </div>
  );
}

function Section({
  title,
  children,
  template,
}: {
  title: string;
  children: ReactNode;
  template: string;
}) {
  return (
    <section style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
      {template === "modern" ? (
        <h2 style={{ fontSize: 11, fontWeight: 800, borderRight: "3px solid #111", paddingRight: 8, margin: "0 0 7px" }}>
          {title}
        </h2>
      ) : template === "corporate" ? (
        <h2 style={{ fontSize: 10.5, fontWeight: 800, borderBottom: "2px solid #111", paddingBottom: 4, margin: "0 0 8px" }}>
          {title}
        </h2>
      ) : template === "minimal" ? (
        <h2 style={{ fontSize: 10, fontWeight: 700, color: "#555", margin: "0 0 8px" }}>{title}</h2>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
          <h2 style={{ fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", margin: 0 }}>{title}</h2>
          <div style={{ flex: 1, height: 1, background: "#bbb" }} />
        </div>
      )}
      {children}
    </section>
  );
}

function CVDocument({ data, template }: { data: CVData; template: string }) {
  const { personalInfo: p, education, experience, skills, courses, languages } = data;
  const isCorporate = template === "corporate";
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  const pageStyle: CSSProperties = {
    fontFamily: "'Noto Sans Arabic', Arial, sans-serif",
    direction: "rtl",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: template === "minimal" ? "16mm 18mm 6mm" : template === "corporate" ? "0 0 6mm" : "14mm 16mm 6mm",
    background: "#fff",
    color: "#111",
    fontSize: 10,
    lineHeight: 1.55,
  };

  const headerStyle: CSSProperties = {
    flex: "0 0 auto",
    padding: isCorporate ? "16mm" : template === "ats" ? "0 0 12px" : "0 0 10px",
    marginBottom: 2,
    textAlign: template === "ats" ? "center" : "right",
    background: isCorporate ? "#111" : "#fff",
    color: isCorporate ? "#fff" : "#111",
    borderBottom: template === "ats" || template === "modern" ? "2px solid #111" : template === "minimal" ? "1px dashed #bbb" : undefined,
  };

  const sections: { title: string; content: ReactNode }[] = [];
  if (p.summary) {
    sections.push({
      title: "الملخص المهني",
      content: <p style={{ margin: 0, fontSize: 10, lineHeight: 1.7, whiteSpace: "pre-line", color: "#333" }}>{p.summary}</p>,
    });
  }
  if (education.length) {
    sections.push({
      title: "المؤهلات العلمية",
      content: education.map((item) => (
        <div key={item.id} style={{ marginBottom: 8, breakInside: "avoid" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{item.degree}{item.field ? ` في ${item.field}` : ""}</div>
              <div style={{ fontSize: 9.5, color: "#444" }}>{item.institution}{item.gpa ? ` · المعدل: ${item.gpa}` : ""}</div>
            </div>
            {item.endDate && <div style={{ whiteSpace: "nowrap", fontSize: 9, color: "#555" }}>{item.endDate}</div>}
          </div>
          {item.description && <p style={{ margin: "3px 0 0", fontSize: 9.5, whiteSpace: "pre-line" }}>{item.description}</p>}
        </div>
      )),
    });
  }
  if (experience.length) {
    sections.push({
      title: "الخبرات العملية",
      content: experience.map((item) => (
        <div key={item.id} style={{ marginBottom: 8, breakInside: "avoid" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{item.jobTitle}</div>
              <div style={{ fontSize: 9.5, color: "#444" }}>{item.company}{item.location ? ` · ${item.location}` : ""}</div>
            </div>
            <div style={{ whiteSpace: "nowrap", fontSize: 9, color: "#555" }}>
              {item.startDate}{item.startDate || item.endDate ? " – " : ""}{item.current ? "حتى الآن" : item.endDate}
            </div>
          </div>
          {item.description && <p style={{ margin: "3px 0 0", fontSize: 9.5, lineHeight: 1.65, whiteSpace: "pre-line" }}>{item.description}</p>}
        </div>
      )),
    });
  }
  if (skills.length) {
    sections.push({
      title: "المهارات",
      content: <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map((item) => (
        <span key={item.id} style={{ border: "1px solid #bbb", borderRadius: template === "minimal" ? 16 : 3, padding: "2px 9px", fontSize: 9, background: template === "modern" ? "#111" : "#f7f7f7", color: template === "modern" ? "#fff" : "#222" }}>{item.name}</span>
      ))}</div>,
    });
  }
  if (languages.length) {
    sections.push({
      title: "اللغات",
      content: <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{languages.map((item) => (
        <span key={item.id}><strong>{item.name}</strong>{item.level ? ` · ${item.level}` : ""}</span>
      ))}</div>,
    });
  }
  if (courses.length) {
    sections.push({
      title: "الدورات والشهادات",
      content: courses.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 5, breakInside: "avoid" }}>
          <div><div style={{ fontWeight: 600 }}>{item.name}</div>{item.provider && <div style={{ fontSize: 9, color: "#555" }}>{item.provider}{item.certificateId ? ` · ${item.certificateId}` : ""}</div>}</div>
          {item.date && <div style={{ whiteSpace: "nowrap", fontSize: 9, color: "#555" }}>{item.date}</div>}
        </div>
      )),
    });
  }

  return (
    <div id="cv-preview" style={pageStyle}>
      <header style={headerStyle}>
        <div style={{ fontSize: template === "minimal" ? 25 : 23, lineHeight: 1.4, fontWeight: 800 }}>{p.fullName}</div>
        {p.jobTitle && <div style={{ fontSize: 11, marginTop: 3, color: isCorporate ? "#ddd" : "#444", fontWeight: 600 }}>{p.jobTitle}</div>}
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: template === "ats" ? "center" : "flex-start", gap: "3px 8px", marginTop: 7, fontSize: 8.5, color: isCorporate ? "#eee" : "#444" }}>
            {contacts.map((contact, index) => (
              <span key={`${contact}-${index}`}>{index > 0 && <span aria-hidden="true" style={{ marginLeft: 8, color: "#999" }}>|</span>}{contact}</span>
            ))}
          </div>
        )}
      </header>
      <div style={{
        flex: "1 0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 12,
        padding: template === "corporate" ? "4px 16mm 0" : "8px 0 0",
      }}>
        {sections.map((item) => (
          <Section key={item.title} title={item.title} template={template}>{item.content}</Section>
        ))}
      </div>
    </div>
  );
}

export default function CVPreview() {
  const { cvData, selectedTemplate } = useCVContext();
  const { personalInfo, education, experience, skills, courses, languages } = cvData;
  const hasContent = Boolean(
    personalInfo.fullName || personalInfo.email || personalInfo.phone ||
    education.length || experience.length || skills.length || courses.length || languages.length,
  );

  if (!hasContent) return <EmptyState />;
  return <CVDocument data={cvData} template={selectedTemplate} />;
}

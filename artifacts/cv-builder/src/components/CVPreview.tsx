import type { CSSProperties, ReactNode } from "react";
import { useCVContext } from "@/context/CVContext";
import type { CVData } from "@/types/cv";

const hasText = (...values: Array<string | undefined>) =>
  values.some((value) => Boolean(value?.trim()));

function BidiText({ children }: { children: ReactNode }) {
  return <bdi dir="auto" style={{ unicodeBidi: "isolate" }}>{children}</bdi>;
}

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
  const visibleEducation = education.filter((item) =>
    hasText(item.degree, item.field, item.institution, item.endDate, item.gpa, item.description),
  );
  const visibleExperience = experience.filter((item) =>
    hasText(item.jobTitle, item.company, item.location, item.startDate, item.endDate, item.description),
  );
  const visibleSkills = skills.filter((item) => hasText(item.name));
  const visibleCourses = courses.filter((item) =>
    hasText(item.name, item.provider, item.date, item.certificateId),
  );
  const visibleLanguages = languages.filter((item) => hasText(item.name, item.level));
  const isCorporate = template === "corporate";
  const contacts = [
    { value: p.email, dir: "ltr" },
    { value: p.phone, dir: "ltr" },
    { value: p.location, dir: "auto" },
    { value: p.linkedin, dir: "ltr" },
    { value: p.website, dir: "ltr" },
  ].filter(({ value }) => hasText(value));

  const pageStyle: CSSProperties = {
    fontFamily: "Arial, Tahoma, 'Segoe UI', system-ui, sans-serif",
    direction: "rtl",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    aspectRatio: "210 / 297",
    padding: template === "minimal" ? "28px 24px 16px" : template === "corporate" ? "0 0 16px" : "24px 22px 16px",
    background: "#fff",
    color: "#111",
    fontSize: 10,
    lineHeight: 1.5,
  };

  const headerStyle: CSSProperties = {
    flex: "0 0 auto",
    padding: isCorporate ? "28px 24px" : template === "ats" ? "0 0 10px" : "0 0 9px",
    marginBottom: 2,
    textAlign: template === "ats" ? "center" : "right",
    background: isCorporate ? "#111" : "#fff",
    color: isCorporate ? "#fff" : "#111",
    borderBottom: template === "ats" || template === "modern" ? "2px solid #111" : template === "minimal" ? "1px dashed #bbb" : undefined,
  };

  const sections: { title: string; content: ReactNode }[] = [];
  if (hasText(p.summary)) {
    sections.push({
      title: "الملخص المهني",
      content: <p dir="auto" style={{ margin: 0, fontSize: 10, lineHeight: 1.6, whiteSpace: "pre-line", color: "#333" }}><BidiText>{p.summary}</BidiText></p>,
    });
  }
  if (visibleExperience.length) {
    sections.push({
      title: "الخبرات العملية",
      content: visibleExperience.map((item) => (
        <div key={item.id} style={{ marginBottom: 8, breakInside: "avoid" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div>
              {hasText(item.jobTitle) && <div dir="auto" style={{ fontSize: 11, fontWeight: 700 }}><BidiText>{item.jobTitle}</BidiText></div>}
              {hasText(item.company, item.location) && <div dir="auto" style={{ fontSize: 9.5, color: "#444" }}><BidiText>{item.company}</BidiText>{hasText(item.location) && <> · <BidiText>{item.location}</BidiText></>}</div>}
            </div>
            {hasText(item.startDate, item.endDate) && <div dir="auto" style={{ whiteSpace: "nowrap", fontSize: 9, color: "#555" }}><BidiText>{item.startDate}{item.startDate || item.endDate ? " – " : ""}{item.current ? "حتى الآن" : item.endDate}</BidiText></div>}
          </div>
          {hasText(item.description) && <p dir="auto" style={{ margin: "3px 0 0", fontSize: 9.5, lineHeight: 1.55, whiteSpace: "pre-line" }}><BidiText>{item.description}</BidiText></p>}
        </div>
      )),
    });
  }
  if (visibleEducation.length) {
    sections.push({
      title: "المؤهلات العلمية",
      content: visibleEducation.map((item) => (
        <div key={item.id} style={{ marginBottom: 8, breakInside: "avoid" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div>
              {hasText(item.degree, item.field) && <div dir="auto" style={{ fontSize: 11, fontWeight: 700 }}><BidiText>{item.degree}{hasText(item.field) ? ` في ${item.field}` : ""}</BidiText></div>}
              {hasText(item.institution, item.gpa) && <div dir="auto" style={{ fontSize: 9.5, color: "#444" }}><BidiText>{item.institution}{hasText(item.gpa) ? ` · المعدل: ${item.gpa}` : ""}</BidiText></div>}
            </div>
            {hasText(item.endDate) && <div dir="auto" style={{ whiteSpace: "nowrap", fontSize: 9, color: "#555" }}><BidiText>{item.endDate}</BidiText></div>}
          </div>
          {hasText(item.description) && <p dir="auto" style={{ margin: "3px 0 0", fontSize: 9.5, lineHeight: 1.55, whiteSpace: "pre-line" }}><BidiText>{item.description}</BidiText></p>}
        </div>
      )),
    });
  }
  if (visibleSkills.length) {
    sections.push({
      title: "المهارات",
      content: <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{visibleSkills.map((item) => (
        <span key={item.id} dir="auto" style={{ border: "1px solid #bbb", borderRadius: template === "minimal" ? 16 : 3, padding: "2px 8px", fontSize: 9, background: template === "modern" ? "#111" : "#f7f7f7", color: template === "modern" ? "#fff" : "#222" }}><BidiText>{item.name}</BidiText></span>
      ))}</div>,
    });
  }
  if (visibleLanguages.length) {
    sections.push({
      title: "اللغات",
      content: <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{visibleLanguages.map((item) => (
        <span key={item.id} dir="auto"><strong><BidiText>{item.name}</BidiText></strong>{hasText(item.level) && <> · <BidiText>{item.level}</BidiText></>}</span>
      ))}</div>,
    });
  }
  if (visibleCourses.length) {
    sections.push({
      title: "الدورات والشهادات",
      content: visibleCourses.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 5, breakInside: "avoid" }}>
          <div>{hasText(item.name) && <div dir="auto" style={{ fontWeight: 600 }}><BidiText>{item.name}</BidiText></div>}{hasText(item.provider, item.certificateId) && <div dir="auto" style={{ fontSize: 9, color: "#555" }}><BidiText>{item.provider}</BidiText>{hasText(item.certificateId) && <> · <BidiText>{item.certificateId}</BidiText></>}</div>}</div>
          {hasText(item.date) && <div dir="auto" style={{ whiteSpace: "nowrap", fontSize: 9, color: "#555" }}><BidiText>{item.date}</BidiText></div>}
        </div>
      )),
    });
  }

  return (
    <div id="cv-preview" style={pageStyle}>
      <header style={headerStyle}>
        {hasText(p.fullName) && <div dir="auto" style={{ fontSize: template === "minimal" ? 25 : 23, lineHeight: 1.4, fontWeight: 800 }}><BidiText>{p.fullName}</BidiText></div>}
        {hasText(p.jobTitle) && <div dir="auto" style={{ fontSize: 11, marginTop: 3, color: isCorporate ? "#ddd" : "#444", fontWeight: 600 }}><BidiText>{p.jobTitle}</BidiText></div>}
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: template === "ats" ? "center" : "flex-start", gap: "3px 8px", marginTop: 7, fontSize: 8.5, color: isCorporate ? "#eee" : "#444" }}>
            {contacts.map(({ value, dir }, index) => (
              <span key={`${value}-${index}`} dir={dir} style={{ unicodeBidi: "isolate" }}>{index > 0 && <span aria-hidden="true" style={{ marginLeft: 8, color: "#999" }}>|</span>}{value}</span>
            ))}
          </div>
        )}
      </header>
      <div style={{
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 10,
        padding: template === "corporate" ? "4px 24px 0" : "7px 0 0",
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
    hasText(personalInfo.fullName, personalInfo.jobTitle, personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website, personalInfo.linkedin, personalInfo.summary) ||
    education.some((item) => hasText(item.degree, item.field, item.institution, item.endDate, item.gpa, item.description)) ||
    experience.some((item) => hasText(item.jobTitle, item.company, item.location, item.startDate, item.endDate, item.description)) ||
    skills.some((item) => hasText(item.name)) ||
    courses.some((item) => hasText(item.name, item.provider, item.date, item.certificateId)) ||
    languages.some((item) => hasText(item.name, item.level)),
  );

  if (!hasContent) return <EmptyState />;
  return <CVDocument data={cvData} template={selectedTemplate} />;
}

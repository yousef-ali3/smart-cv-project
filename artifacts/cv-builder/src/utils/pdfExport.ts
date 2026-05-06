import type { CVData } from "@/types/cv";
import type { TemplateId } from "@/context/CVContext";

// ─── Shared block builders ─────────────────────────────────────────────────────
function buildBlocks(cvData: CVData) {
  const { personalInfo: p, education, experience, skills, courses, languages } = cvData;

  const contact = [
    p.email && `<span>${p.email}</span>`,
    p.phone && `<span>${p.phone}</span>`,
    p.location && `<span>${p.location}</span>`,
    p.linkedin && `<span>${p.linkedin}</span>`,
    p.website && `<span>${p.website}</span>`,
  ].filter(Boolean);

  const expHTML = experience.map(e => `
    <div class="entry">
      <div class="entry-top">
        <div>
          <div class="entry-title">${e.jobTitle || ""}</div>
          <div class="entry-sub">${e.company || ""}${e.location ? " · " + e.location : ""}</div>
        </div>
        <div class="entry-date">${e.startDate || ""}${(e.startDate || e.endDate) ? " – " : ""}${e.current ? "حتى الآن" : (e.endDate || "")}</div>
      </div>
      ${e.description ? `<div class="entry-desc">${e.description.replace(/\n/g, "<br>")}</div>` : ""}
    </div>`).join("");

  const eduHTML = education.map(ed => `
    <div class="entry">
      <div class="entry-top">
        <div>
          <div class="entry-title">${ed.degree || ""}${ed.field ? " في " + ed.field : ""}</div>
          <div class="entry-sub">${ed.institution || ""}${ed.gpa ? " · المعدل: " + ed.gpa : ""}</div>
        </div>
        ${ed.endDate ? `<div class="entry-date">${ed.endDate}</div>` : ""}
      </div>
      ${ed.description ? `<div class="entry-desc">${ed.description.replace(/\n/g, "<br>")}</div>` : ""}
    </div>`).join("");

  const skillsHTML = `<div class="skills-grid">${skills.map(s => `<span class="skill-tag">${s.name}</span>`).join("")}</div>`;
  const langsHTML = `<div class="skills-grid">${languages.map(l => `<span class="skill-tag">${l.name}${l.level ? " · " + l.level : ""}</span>`).join("")}</div>`;
  const coursesHTML = courses.map(c => `
    <div class="entry">
      <div class="entry-top">
        <div>
          <div class="entry-title">${c.name || ""}</div>
          ${c.provider ? `<div class="entry-sub">${c.provider}${c.certificateId ? " · " + c.certificateId : ""}</div>` : ""}
        </div>
        ${c.date ? `<div class="entry-date">${c.date}</div>` : ""}
      </div>
    </div>`).join("");

  return { p, contact, expHTML, eduHTML, skillsHTML, langsHTML, coursesHTML, hasSkills: skills.length > 0, hasLangs: languages.length > 0, hasExp: experience.length > 0, hasEdu: education.length > 0, hasCourses: courses.length > 0 };
}

// ─── Template stylesheets ──────────────────────────────────────────────────────
const baseCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');
  @page { margin: 0; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Noto Sans Arabic','Segoe UI',Arial,sans-serif; color: #111; background: #fff; font-size: 11pt; line-height: 1.5; direction: rtl; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { max-width: 210mm; margin: 0 auto; }
  .entry { margin-bottom: 10px; }
  .entry-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
  .entry-title { font-size: 11pt; font-weight: 700; color: #000; }
  .entry-sub { font-size: 10pt; color: #444; font-weight: 600; }
  .entry-date { font-size: 9pt; color: #666; white-space: nowrap; margin-top: 1px; }
  .entry-desc { font-size: 10pt; color: #333; margin-top: 4px; white-space: pre-line; }
  .summary { font-size: 10.5pt; color: #333; line-height: 1.7; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
`;

function atsCSS() {
  return baseCSS + `
    .page { padding: 18mm 16mm; }
    .header { text-align: center; margin-bottom: 14px; border-bottom: 2px solid #111; padding-bottom: 14px; }
    .name { font-size: 24pt; font-weight: 900; color: #000; letter-spacing: -0.5px; }
    .job-title { font-size: 12pt; font-weight: 600; color: #444; margin-top: 4px; }
    .contact { margin-top: 8px; font-size: 9pt; color: #555; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 0; }
    .sep { margin: 0 6px; color: #bbb; }
    .section { margin-top: 14px; }
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #000; white-space: nowrap; }
    .section-line { flex: 1; height: 1.5px; background: #ccc; }
    .skill-tag { background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; padding: 2px 10px; font-size: 9.5pt; color: #222; }
  `;
}

function modernCSS() {
  return baseCSS + `
    .page { padding: 18mm 16mm; }
    .header { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid #000; }
    .name { font-size: 26pt; font-weight: 900; color: #000; letter-spacing: -1px; }
    .job-title { font-size: 12pt; font-weight: 600; color: #444; margin-top: 3px; }
    .contact { margin-top: 8px; font-size: 9pt; color: #555; display: flex; flex-wrap: wrap; gap: 4px 14px; }
    .sep { display: none; }
    .section { margin-top: 14px; }
    .section-header { border-right: 3px solid #000; padding-right: 8px; margin-bottom: 8px; }
    .section-title { font-size: 11pt; font-weight: 800; color: #000; }
    .section-line { display: none; }
    .entry { padding-right: 10px; }
    .entry-date { background: #f3f3f3; padding: 2px 10px; border-radius: 12px; }
    .skills-grid { padding-right: 10px; }
    .skill-tag { background: #111; color: #fff; border-radius: 4px; padding: 2px 10px; font-size: 9.5pt; }
  `;
}

function corporateCSS() {
  return baseCSS + `
    .header { background: #111; color: #fff; padding: 18px 16mm; margin-bottom: 4px; }
    .name { font-size: 26pt; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
    .job-title { font-size: 12pt; color: #ccc; margin-top: 4px; font-weight: 500; }
    .contact { margin-top: 12px; font-size: 9pt; color: #bbb; display: flex; flex-wrap: wrap; gap: 4px 14px; }
    .sep { display: none; }
    .body { padding: 4px 16mm 18mm; }
    .section { margin-top: 14px; }
    .section-header { margin-bottom: 8px; }
    .section-title { font-size: 11pt; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 2px; display: block; padding-bottom: 4px; border-bottom: 2px solid #000; }
    .section-line { display: none; }
    .skill-tag { border: 1.5px solid #111; border-radius: 3px; padding: 2px 10px; font-size: 9.5pt; color: #111; font-weight: 500; }
  `;
}

function minimalCSS() {
  return baseCSS + `
    .page { padding: 22mm 18mm; }
    .header { margin-bottom: 16px; }
    .name { font-size: 28pt; font-weight: 900; color: #111; letter-spacing: -1.2px; }
    .job-title { font-size: 12pt; color: #777; margin-top: 4px; font-style: italic; }
    .contact { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; font-size: 9pt; color: #666; display: flex; flex-wrap: wrap; gap: 4px 16px; }
    .sep { display: none; }
    .section { margin-top: 18px; }
    .section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .section-title { font-size: 10pt; font-weight: 700; color: #555; letter-spacing: 1.5px; text-transform: uppercase; }
    .section-line { display: none; }
    .section-header::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #555; display: inline-block; flex-shrink: 0; }
    .entry-date { font-style: italic; color: #999; }
    .entry-desc { line-height: 1.7; color: #555; }
    .skill-tag { background: #f8f8f8; border: 1px solid #e5e5e5; border-radius: 20px; padding: 3px 12px; font-size: 9.5pt; color: #333; }
  `;
}

// ─── HTML template generators ──────────────────────────────────────────────────
function section(title: string, content: string) {
  return `<div class="section"><div class="section-header"><span class="section-title">${title}</span><div class="section-line"></div></div>${content}</div>`;
}

function buildHTML(cvData: CVData, templateId: TemplateId): string {
  const b = buildBlocks(cvData);
  if (!b.p.fullName && !b.hasEdu && !b.hasExp) return "";

  let css: string;
  switch (templateId) {
    case "modern": css = modernCSS(); break;
    case "corporate": css = corporateCSS(); break;
    case "minimal": css = minimalCSS(); break;
    default: css = atsCSS();
  }

  // ATS header uses pipe separators; others use spacing
  const sep = templateId === "ats" ? '<span class="sep">|</span>' : "";
  const contactHTML = b.contact.length ? `<div class="contact">${b.contact.join(sep)}</div>` : "";

  const summaryHTML = b.p.summary ? section("الملخص المهني", `<p class="summary">${b.p.summary}</p>`) : "";
  const expSection = b.hasExp ? section("الخبرات العملية", b.expHTML) : "";
  const eduSection = b.hasEdu ? section("المؤهلات العلمية", b.eduHTML) : "";
  const skillsSection = b.hasSkills ? section("المهارات", b.skillsHTML) : "";
  const langsSection = b.hasLangs ? section("اللغات", b.langsHTML) : "";
  const coursesSection = b.hasCourses ? section("الدورات والشهادات", b.coursesHTML) : "";

  const headerInner = `
    <div class="name">${b.p.fullName || ""}</div>
    ${b.p.jobTitle ? `<div class="job-title">${b.p.jobTitle}</div>` : ""}
    ${contactHTML}
  `;

  // Corporate has a different page structure (header outside .page padding)
  if (templateId === "corporate") {
    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>السيرة الذاتية - ${b.p.fullName || ""}</title><style>${css}</style></head>
<body>
  <div class="page">
    <div class="header">${headerInner}</div>
    <div class="body">
      ${summaryHTML}${expSection}${eduSection}${skillsSection}${langsSection}${coursesSection}
    </div>
  </div>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>السيرة الذاتية - ${b.p.fullName || ""}</title><style>${css}</style></head>
<body>
  <div class="page">
    <div class="header">${headerInner}</div>
    ${summaryHTML}${expSection}${eduSection}${skillsSection}${langsSection}${coursesSection}
  </div>
</body>
</html>`;
}

// ─── Public API ────────────────────────────────────────────────────────────────
export function exportToPDF(cvData: CVData, templateId: TemplateId = "ats") {
  const html = buildHTML(cvData, templateId);
  if (!html) {
    alert("الرجاء إدخال بياناتك أولاً قبل الحفظ.");
    return;
  }

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("الرجاء السماح بالنوافذ المنبثقة في المتصفح للتمكن من حفظ PDF.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    // Wait for Google Fonts (Noto Sans Arabic) to fully load before printing
    printWindow.document.fonts.ready.then(() => {
      // Extra small delay for final layout settle
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 200);
    });
  };

  // Fallback in case onload doesn't fire (e.g. some browsers)
  setTimeout(() => {
    try {
      printWindow.document.fonts.ready.then(() => {
        printWindow.focus();
        printWindow.print();
      });
    } catch (_) {}
  }, 3000);
}

import type { CVData } from "@/types/cv";
import type { TemplateId } from "@/context/CVContext";

const escapeHTML = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] ?? char);

const text = (value?: string) => escapeHTML(value || "");
const multiline = (value?: string) => text(value).replace(/\n/g, "<br>");

function section(title: string, content: string) {
  return `<section class="section"><h2 class="section-title">${title}</h2>${content}</section>`;
}

function buildHTML(cvData: CVData, template: TemplateId) {
  const { personalInfo: p, education, experience, skills, courses, languages } = cvData;
  if (!p.fullName && !p.email && !education.length && !experience.length) return "";

  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website]
    .filter(Boolean)
    .map((item) => `<span>${text(item)}</span>`)
    .join('<span class="contact-separator" aria-hidden="true">|</span>');

  const summary = p.summary
    ? section("الملخص المهني", `<p class="summary">${multiline(p.summary)}</p>`)
    : "";
  const educationHTML = education.length
    ? section("المؤهلات العلمية", education.map((item) => `
        <div class="entry">
          <div class="entry-top">
            <div>
              <div class="entry-title">${text(item.degree)}${item.field ? ` في ${text(item.field)}` : ""}</div>
              <div class="entry-sub">${text(item.institution)}${item.gpa ? ` · المعدل: ${text(item.gpa)}` : ""}</div>
            </div>
            ${item.endDate ? `<div class="entry-date">${text(item.endDate)}</div>` : ""}
          </div>
          ${item.description ? `<div class="entry-desc">${multiline(item.description)}</div>` : ""}
        </div>`).join(""))
    : "";
  const experienceHTML = experience.length
    ? section("الخبرات العملية", experience.map((item) => `
        <div class="entry">
          <div class="entry-top">
            <div>
              <div class="entry-title">${text(item.jobTitle)}</div>
              <div class="entry-sub">${text(item.company)}${item.location ? ` · ${text(item.location)}` : ""}</div>
            </div>
            <div class="entry-date">${text(item.startDate)}${item.startDate || item.endDate ? " – " : ""}${item.current ? "حتى الآن" : text(item.endDate)}</div>
          </div>
          ${item.description ? `<div class="entry-desc">${multiline(item.description)}</div>` : ""}
        </div>`).join(""))
    : "";
  const skillsHTML = skills.length
    ? section("المهارات", `<div class="tags">${skills.map((item) => `<span class="tag">${text(item.name)}</span>`).join("")}</div>`)
    : "";
  const languagesHTML = languages.length
    ? section("اللغات", `<div class="tags">${languages.map((item) => `<span class="tag">${text(item.name)}${item.level ? ` · ${text(item.level)}` : ""}</span>`).join("")}</div>`)
    : "";
  const coursesHTML = courses.length
    ? section("الدورات والشهادات", courses.map((item) => `
        <div class="entry">
          <div class="entry-top">
            <div>
              <div class="entry-title">${text(item.name)}</div>
              ${item.provider ? `<div class="entry-sub">${text(item.provider)}${item.certificateId ? ` · ${text(item.certificateId)}` : ""}</div>` : ""}
            </div>
            ${item.date ? `<div class="entry-date">${text(item.date)}</div>` : ""}
          </div>
        </div>`).join(""))
    : "";

  const corporate = template === "corporate";
  const header = `
    <header class="header">
      <div class="name">${text(p.fullName)}</div>
      ${p.jobTitle ? `<div class="job-title">${text(p.jobTitle)}</div>` : ""}
      ${contacts ? `<div class="contact">${contacts}</div>` : ""}
    </header>`;
  const body = [summary, educationHTML, experienceHTML, skillsHTML, languagesHTML, coursesHTML]
    .filter(Boolean)
    .join("");

  const templateStyles: Record<TemplateId, string> = {
    ats: `
      .page { padding: 16mm; }
      .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 12px; }
      .name { font-size: 23pt; font-weight: 800; }
      .job-title { margin-top: 3px; font-size: 11pt; font-weight: 600; }
      .contact { justify-content: center; margin-top: 7px; }
      .section-title { display: flex; align-items: center; gap: 10px; }
      .section-title::after { content: ""; flex: 1; height: 1px; background: #aaa; }
    `,
    modern: `
      .page { padding: 16mm; }
      .header { border-bottom: 2px solid #111; padding-bottom: 10px; }
      .name { font-size: 25pt; font-weight: 800; }
      .job-title { margin-top: 3px; font-size: 11pt; }
      .section-title { border-right: 3px solid #111; padding-right: 8px; }
      .tag { background: #111; color: #fff; }
    `,
    corporate: `
      .page { padding: 0 0 14mm; }
      .header { background: #111; color: #fff; padding: 16mm; }
      .name { font-size: 25pt; font-weight: 800; }
      .job-title { margin-top: 3px; color: #ddd; font-size: 11pt; }
      .contact { color: #eee; margin-top: 8px; }
      .content { padding: 4mm 16mm 0; }
      .section-title { border-bottom: 2px solid #111; padding-bottom: 4px; }
    `,
    minimal: `
      .page { padding: 19mm 18mm; }
      .header { padding-bottom: 9px; border-bottom: 1px dashed #aaa; }
      .name { font-size: 26pt; font-weight: 800; }
      .job-title { margin-top: 3px; color: #555; font-size: 11pt; }
      .section-title { color: #444; }
      .tag { border-radius: 16px; }
    `,
  };

  return `<!doctype html>
  <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>السيرة الذاتية - ${text(p.fullName)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap');
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body { color: #111; background: #fff; font: 10.5pt/1.55 'Noto Sans Arabic', Arial, sans-serif; direction: rtl; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 210mm; min-height: 297mm; margin: 0 auto; display: flex; flex-direction: column; }
        .header { flex: 0 0 auto; }
        .name { line-height: 1.35; }
        .contact { display: flex; flex-wrap: wrap; align-items: center; gap: 3px 8px; font-size: 9pt; color: #444; }
        .content { flex: 1 0 auto; display: flex; flex-direction: column; justify-content: space-evenly; gap: 7mm; padding-top: 5mm; }
        .section { break-inside: avoid; page-break-inside: avoid; }
        .section-title { margin: 0 0 6px; font-size: 10.5pt; font-weight: 700; }
        .entry { margin-bottom: 7px; break-inside: avoid; page-break-inside: avoid; }
        .entry:last-child { margin-bottom: 0; }
        .entry-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .entry-title { font-weight: 700; color: #111; }
        .entry-sub { font-size: 9.5pt; color: #444; }
        .entry-date { flex: 0 0 auto; white-space: nowrap; font-size: 9pt; color: #555; }
        .entry-desc, .summary { margin: 4px 0 0; font-size: 9.8pt; line-height: 1.65; white-space: pre-line; }
        .tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .tag { display: inline-block; padding: 2px 9px; border: 1px solid #bbb; font-size: 9pt; border-radius: 3px; }
        .contact-separator { color: #999; }
        ${templateStyles[template]}
        @media screen {
          body { background: #eee; padding: 16px 0; }
          .page { box-shadow: 0 2px 18px #0002; }
        }
        @media print {
          body { background: #fff; }
          .page { margin: 0; box-shadow: none; }
        }
      </style>
    </head>
    <body><main class="page">${header}<div class="content">${body}</div></main></body>
  </html>`;
}

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

  let hasPrinted = false;
  const print = () => {
    if (hasPrinted || printWindow.closed) return;
    hasPrinted = true;
    printWindow.focus();
    printWindow.print();
  };
  printWindow.onload = () => {
    void printWindow.document.fonts.ready.then(() => window.setTimeout(print, 150));
  };
  window.setTimeout(print, 3000);
}

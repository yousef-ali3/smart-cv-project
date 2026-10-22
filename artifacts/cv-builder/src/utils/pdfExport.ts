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

const hasText = (...values: Array<string | undefined>) =>
  values.some((value) => Boolean(value?.trim()));
const bidi = (value?: string) => `<bdi dir="auto">${text(value)}</bdi>`;
const bidiMultiline = (value?: string) =>
  `<bdi dir="auto">${multiline(value)}</bdi>`;

export function buildCVHtml(cvData: CVData, template: TemplateId) {
  const { personalInfo: p, education, experience, skills, courses, languages } = cvData;
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

  if (
    !hasText(p.fullName, p.jobTitle, p.email, p.phone, p.location, p.linkedin, p.website, p.summary) &&
    !visibleEducation.length &&
    !visibleExperience.length &&
    !visibleSkills.length &&
    !visibleCourses.length &&
    !visibleLanguages.length
  ) return "";

  const contacts = [
    { value: p.email, dir: "ltr" },
    { value: p.phone, dir: "ltr" },
    { value: p.location, dir: "auto" },
    { value: p.linkedin, dir: "ltr" },
    { value: p.website, dir: "ltr" },
  ]
    .filter(({ value }) => hasText(value))
    .map(({ value, dir }) => `<span dir="${dir}">${text(value)}</span>`)
    .join('<span class="contact-separator" aria-hidden="true">|</span>');

  const summary = hasText(p.summary)
    ? section("الملخص المهني", `<p class="summary" dir="auto">${bidiMultiline(p.summary)}</p>`)
    : "";
  const experienceHTML = visibleExperience.length
    ? section("الخبرات العملية", visibleExperience.map((item) => `
        <div class="entry">
          <div class="entry-top">
            <div>
              <div class="entry-title" dir="auto">${bidi(item.jobTitle)}</div>
              ${hasText(item.company, item.location) ? `<div class="entry-sub" dir="auto">${bidi(item.company)}${hasText(item.location) ? ` · ${bidi(item.location)}` : ""}</div>` : ""}
            </div>
            ${hasText(item.startDate, item.endDate) ? `<div class="entry-date" dir="auto">${bidi(item.startDate)}${hasText(item.startDate, item.endDate) ? " – " : ""}${item.current ? "حتى الآن" : bidi(item.endDate)}</div>` : ""}
          </div>
          ${hasText(item.description) ? `<div class="entry-desc" dir="auto">${bidiMultiline(item.description)}</div>` : ""}
        </div>`).join(""))
    : "";
  const educationHTML = visibleEducation.length
    ? section("المؤهلات العلمية", visibleEducation.map((item) => `
        <div class="entry">
          <div class="entry-top">
            <div>
              ${hasText(item.degree, item.field) ? `<div class="entry-title" dir="auto">${bidi(item.degree)}${hasText(item.field) ? ` في ${bidi(item.field)}` : ""}</div>` : ""}
              ${hasText(item.institution, item.gpa) ? `<div class="entry-sub" dir="auto">${bidi(item.institution)}${hasText(item.gpa) ? ` · المعدل: ${bidi(item.gpa)}` : ""}</div>` : ""}
            </div>
            ${hasText(item.endDate) ? `<div class="entry-date" dir="auto">${bidi(item.endDate)}</div>` : ""}
          </div>
          ${hasText(item.description) ? `<div class="entry-desc" dir="auto">${bidiMultiline(item.description)}</div>` : ""}
        </div>`).join(""))
    : "";
  const skillsHTML = visibleSkills.length
    ? section("المهارات", `<div class="tags">${visibleSkills.map((item) => `<span class="tag" dir="auto">${bidi(item.name)}</span>`).join("")}</div>`)
    : "";
  const languagesHTML = visibleLanguages.length
    ? section("اللغات", `<div class="tags">${visibleLanguages.map((item) => `<span class="tag" dir="auto">${bidi(item.name)}${hasText(item.level) ? ` · ${bidi(item.level)}` : ""}</span>`).join("")}</div>`)
    : "";
  const coursesHTML = visibleCourses.length
    ? section("الدورات والشهادات", visibleCourses.map((item) => `
        <div class="entry">
          <div class="entry-top">
            <div>
              ${hasText(item.name) ? `<div class="entry-title" dir="auto">${bidi(item.name)}</div>` : ""}
              ${hasText(item.provider, item.certificateId) ? `<div class="entry-sub" dir="auto">${bidi(item.provider)}${hasText(item.certificateId) ? ` · ${bidi(item.certificateId)}` : ""}</div>` : ""}
            </div>
            ${hasText(item.date) ? `<div class="entry-date" dir="auto">${bidi(item.date)}</div>` : ""}
          </div>
        </div>`).join(""))
    : "";

  const header = `
    <header class="header">
      ${hasText(p.fullName) ? `<div class="name" dir="auto">${bidi(p.fullName)}</div>` : ""}
      ${hasText(p.jobTitle) ? `<div class="job-title" dir="auto">${bidi(p.jobTitle)}</div>` : ""}
      ${contacts ? `<div class="contact">${contacts}</div>` : ""}
    </header>`;
  const body = [summary, experienceHTML, educationHTML, skillsHTML, languagesHTML, coursesHTML]
    .filter(Boolean)
    .join("");

  const templateStyles: Record<TemplateId, string> = {
    ats: `
      .page { padding: 11mm 13mm 9mm; }
      .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 12px; }
      .name { font-size: 23pt; font-weight: 800; }
      .job-title { margin-top: 3px; font-size: 11pt; font-weight: 600; }
      .contact { justify-content: center; margin-top: 7px; }
      .section-title { display: flex; align-items: center; gap: 10px; }
      .section-title::after { content: ""; flex: 1; height: 1px; background: #aaa; }
    `,
    modern: `
      .page { padding: 11mm 13mm 9mm; }
      .header { border-bottom: 2px solid #111; padding-bottom: 10px; }
      .name { font-size: 25pt; font-weight: 800; }
      .job-title { margin-top: 3px; font-size: 11pt; }
      .section-title { border-right: 3px solid #111; padding-right: 8px; }
      .tag { background: #111; color: #fff; }
    `,
    corporate: `
      .page { padding: 0 0 9mm; }
      .header { background: #111; color: #fff; padding: 12mm 13mm; }
      .name { font-size: 25pt; font-weight: 800; }
      .job-title { margin-top: 3px; color: #ddd; font-size: 11pt; }
      .contact { color: #eee; margin-top: 8px; }
      .content { padding: 4mm 16mm 0; }
      .section-title { border-bottom: 2px solid #111; padding-bottom: 4px; }
    `,
    minimal: `
      .page { padding: 14mm 15mm 9mm; }
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
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body { color: #111; background: #fff; font: 10pt/1.5 Arial, Tahoma, 'Segoe UI', system-ui, sans-serif; direction: rtl; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 210mm; min-height: 297mm; margin: 0 auto; display: flex; flex-direction: column; }
        .header { flex: 0 0 auto; }
        .name { line-height: 1.35; }
        .contact { display: flex; flex-wrap: wrap; align-items: center; gap: 3px 8px; font-size: 9pt; color: #444; }
        .content { display: flex; flex-direction: column; justify-content: flex-start; gap: 11px; padding-top: 4mm; }
        .section { break-inside: avoid; page-break-inside: avoid; }
        .section-title { margin: 0 0 5px; font-size: 10pt; font-weight: 700; }
        .entry { margin-bottom: 6px; break-inside: avoid; page-break-inside: avoid; }
        .entry:last-child { margin-bottom: 0; }
        .entry-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .entry-title { font-weight: 700; color: #111; }
        .entry-sub { font-size: 9pt; color: #444; }
        .entry-date { flex: 0 0 auto; white-space: nowrap; font-size: 8.5pt; color: #555; }
        .entry-desc, .summary { margin: 3px 0 0; font-size: 9.5pt; line-height: 1.55; white-space: pre-line; }
        .tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .tag { display: inline-block; padding: 2px 8px; border: 1px solid #bbb; font-size: 8.8pt; border-radius: 3px; }
        bdi { unicode-bidi: isolate; }
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
  const html = buildCVHtml(cvData, templateId);
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

  let isPreparing = false;
  let hasPrinted = false;
  const print = () => {
    if (isPreparing || hasPrinted || printWindow.closed) return;
    isPreparing = true;
    void printWindow.document.fonts.ready.then(() => {
      window.requestAnimationFrame(() => {
        if (printWindow.closed) return;
        window.setTimeout(() => {
          if (printWindow.closed || hasPrinted) return;
          hasPrinted = true;
          printWindow.focus();
          printWindow.print();
        }, 100);
      });
    });
  };
  printWindow.onload = () => {
    print();
  };
  window.setTimeout(print, 1800);
}

import type { CVData } from "@/types/cv";

function skillLevelWidth(level: string): string {
  switch (level) {
    case "مبتدئ": return "25%";
    case "متوسط": return "50%";
    case "متقدم": return "75%";
    case "خبير": return "100%";
    default: return "50%";
  }
}

export function generatePrintHTML(cvData: CVData): string {
  const { personalInfo, education, experience, skills, courses, languages } = cvData;

  const hasContent = personalInfo.fullName || education.length > 0 || experience.length > 0;
  if (!hasContent) return "";

  const section = (title: string, content: string) => `
    <div class="section">
      <div class="section-header">
        <span class="section-title">${title}</span>
        <div class="section-line"></div>
      </div>
      ${content}
    </div>`;

  const experienceHTML = experience.length > 0 ? section("الخبرات العملية", experience.map(exp => `
    <div class="entry">
      <div class="entry-top">
        <div>
          <div class="entry-title">${exp.jobTitle || ""}</div>
          <div class="entry-sub">${exp.company || ""}${exp.location ? " · " + exp.location : ""}</div>
        </div>
        <div class="entry-date">${exp.startDate || ""}${(exp.startDate || exp.endDate) ? " – " : ""}${exp.current ? "حتى الآن" : (exp.endDate || "")}</div>
      </div>
      ${exp.description ? `<div class="entry-desc">${exp.description.replace(/\n/g, "<br>")}</div>` : ""}
    </div>`).join("")) : "";

  const educationHTML = education.length > 0 ? section("المؤهلات العلمية", education.map(edu => `
    <div class="entry">
      <div class="entry-top">
        <div>
          <div class="entry-title">${edu.degree || ""}${edu.field ? " في " + edu.field : ""}</div>
          <div class="entry-sub">${edu.institution || ""}${edu.gpa ? " · المعدل: " + edu.gpa : ""}</div>
          ${edu.description ? `<div class="entry-desc">${edu.description}</div>` : ""}
        </div>
        <div class="entry-date">${edu.startDate || ""}${(edu.startDate || edu.endDate) ? " – " : ""}${edu.endDate || ""}</div>
      </div>
    </div>`).join("")) : "";

  const skillsHTML = skills.length > 0 ? section("المهارات", `
    <div class="skills-grid">
      ${skills.map(s => `<span class="skill-tag">${s.name}</span>`).join("")}
    </div>`) : "";

  const languagesHTML = languages.length > 0 ? section("اللغات", `
    <div class="skills-grid">
      ${languages.map(l => `<span class="skill-tag">${l.name}${l.level ? " · " + l.level : ""}</span>`).join("")}
    </div>`) : "";

  const coursesHTML = courses.length > 0 ? section("الدورات التدريبية والشهادات", courses.map(c => `
    <div class="entry">
      <div class="entry-top">
        <div>
          <div class="entry-title">${c.name || ""}</div>
          ${c.provider ? `<div class="entry-sub">${c.provider}${c.certificateId ? " · " + c.certificateId : ""}</div>` : ""}
        </div>
        ${c.date ? `<div class="entry-date">${c.date}</div>` : ""}
      </div>
    </div>`).join("")) : "";

  const summaryHTML = personalInfo.summary ? section("الملخص المهني", `<p class="summary">${personalInfo.summary}</p>`) : "";

  const contactItems = [
    personalInfo.email && `<span>${personalInfo.email}</span>`,
    personalInfo.phone && `<span>${personalInfo.phone}</span>`,
    personalInfo.location && `<span>${personalInfo.location}</span>`,
    personalInfo.linkedin && `<span>${personalInfo.linkedin}</span>`,
    personalInfo.website && `<span>${personalInfo.website}</span>`,
  ].filter(Boolean).join('<span class="sep">|</span>');

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>السيرة الذاتية - ${personalInfo.fullName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Sans Arabic', 'Segoe UI', Arial, sans-serif;
      color: #111;
      background: #fff;
      font-size: 11pt;
      line-height: 1.5;
      direction: rtl;
    }
    .page {
      max-width: 210mm;
      margin: 0 auto;
      padding: 18mm 16mm;
    }
    .header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #111; padding-bottom: 14px; }
    .name { font-size: 24pt; font-weight: 900; color: #000; letter-spacing: -0.5px; }
    .job-title { font-size: 12pt; font-weight: 600; color: #444; margin-top: 4px; }
    .contact { margin-top: 8px; font-size: 9pt; color: #555; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 0; }
    .sep { margin: 0 6px; color: #bbb; }
    .section { margin-top: 14px; }
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #000; white-space: nowrap; }
    .section-line { flex: 1; height: 1.5px; background: #ccc; }
    .entry { margin-bottom: 10px; }
    .entry-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .entry-title { font-size: 11pt; font-weight: 700; color: #000; }
    .entry-sub { font-size: 10pt; color: #444; font-weight: 600; }
    .entry-date { font-size: 9pt; color: #666; white-space: nowrap; margin-top: 1px; }
    .entry-desc { font-size: 10pt; color: #333; margin-top: 4px; white-space: pre-line; }
    .summary { font-size: 10.5pt; color: #333; line-height: 1.7; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag { background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; padding: 2px 10px; font-size: 9.5pt; color: #222; }
    @media print {
      body { margin: 0; }
      .page { padding: 12mm 14mm; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="name">${personalInfo.fullName}</div>
      ${personalInfo.jobTitle ? `<div class="job-title">${personalInfo.jobTitle}</div>` : ""}
      ${contactItems ? `<div class="contact">${contactItems}</div>` : ""}
    </div>
    ${summaryHTML}
    ${experienceHTML}
    ${educationHTML}
    ${skillsHTML}
    ${languagesHTML}
    ${coursesHTML}
  </div>
</body>
</html>`;
}

export function exportToPDF(cvData: CVData, filename: string = "سيرتي-الذاتية") {
  const html = generatePrintHTML(cvData);
  if (!html) {
    alert("الرجاء إدخال بياناتك أولاً قبل التحميل.");
    return;
  }

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("الرجاء السماح بالنوافذ المنبثقة في المتصفح للتمكن من تحميل PDF.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 600);
  };

  // Fallback for browsers where onload doesn't fire
  setTimeout(() => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch (_) {}
  }, 1200);
}

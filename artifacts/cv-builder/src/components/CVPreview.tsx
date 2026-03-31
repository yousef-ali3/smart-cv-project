import { useCVContext } from "@/context/CVContext";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

function Section({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3 mt-5 first:mt-0">
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1a3c6e]">{title}</h2>
      <div className="flex-1 h-[1.5px] bg-[#1a3c6e]/20" />
    </div>
  );
}

const skillLevelWidth = (level: string) => {
  switch (level) {
    case "مبتدئ": return "25%";
    case "متوسط": return "50%";
    case "متقدم": return "75%";
    case "خبير": return "100%";
    default: return "50%";
  }
};

export default function CVPreview() {
  const { cvData } = useCVContext();
  const { personalInfo, education, experience, skills, courses, languages } = cvData;

  const hasContent = personalInfo.fullName || personalInfo.email || education.length > 0 || experience.length > 0;

  if (!hasContent) {
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

  return (
    <div
      id="cv-preview"
      className="bg-white text-[#1a1a1a] font-sans w-full"
      style={{ fontFamily: "'Segoe UI', 'Noto Sans Arabic', Arial, sans-serif", direction: "rtl", minHeight: "297mm", padding: "12mm 14mm" }}
    >
      <div className="flex gap-4 items-start mb-4">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="صورة شخصية"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#1a3c6e]/20 shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-black text-[#1a3c6e] leading-tight">{personalInfo.fullName}</h1>
          {personalInfo.jobTitle && (
            <p className="text-sm font-semibold text-[#4a7fb5] mt-0.5">{personalInfo.jobTitle}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {personalInfo.email && (
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <Mail className="w-3 h-3" />{personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <Phone className="w-3 h-3" />{personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <MapPin className="w-3 h-3" />{personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <Linkedin className="w-3 h-3" />{personalInfo.linkedin}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <Globe className="w-3 h-3" />{personalInfo.website}
              </span>
            )}
          </div>
        </div>
      </div>

      {personalInfo.summary && (
        <>
          <Section title="الملخص المهني" />
          <p className="text-[10.5px] text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </>
      )}

      {experience.length > 0 && (
        <>
          <Section title="الخبرات العملية" />
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold text-[#1a3c6e]">{exp.jobTitle}</p>
                    <p className="text-[10px] font-semibold text-gray-600">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <p className="text-[9.5px] text-gray-500 shrink-0 mt-0.5">
                    {exp.startDate}{(exp.startDate || exp.endDate) && " – "}{exp.current ? "حتى الآن" : exp.endDate}
                  </p>
                </div>
                {exp.description && (
                  <div className="mt-1 text-[10px] text-gray-700 leading-relaxed whitespace-pre-line pr-2">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {education.length > 0 && (
        <>
          <Section title="المؤهلات العلمية" />
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold text-[#1a3c6e]">{edu.degree}{edu.field ? ` في ${edu.field}` : ""}</p>
                  <p className="text-[10px] text-gray-600">{edu.institution}{edu.gpa ? ` · المعدل: ${edu.gpa}` : ""}</p>
                  {edu.description && <p className="text-[9.5px] text-gray-500 mt-0.5">{edu.description}</p>}
                </div>
                <p className="text-[9.5px] text-gray-500 shrink-0 mt-0.5">
                  {edu.startDate}{(edu.startDate || edu.endDate) && " – "}{edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {skills.length > 0 && (
        <>
          <Section title="المهارات" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[10px] font-medium">{skill.name}</span>
                  <span className="text-[9px] text-gray-500">{skill.level}</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-[#1a3c6e] rounded-full"
                    style={{ width: skillLevelWidth(skill.level) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {languages.length > 0 && (
        <>
          <Section title="اللغات" />
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-semibold">{lang.name}</span>
                <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{lang.level}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {courses.length > 0 && (
        <>
          <Section title="الدورات التدريبية والشهادات" />
          <div className="space-y-1.5">
            {courses.map((course) => (
              <div key={course.id} className="flex justify-between items-start">
                <div>
                  <p className="text-[10.5px] font-semibold">{course.name}</p>
                  {course.provider && <p className="text-[9.5px] text-gray-500">{course.provider}{course.certificateId ? ` · ${course.certificateId}` : ""}</p>}
                </div>
                {course.date && <p className="text-[9.5px] text-gray-500 shrink-0">{course.date}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

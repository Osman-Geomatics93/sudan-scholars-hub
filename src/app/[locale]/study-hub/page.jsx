import { StudyHubClient } from "./study-hub-client";

export async function generateMetadata({ params: { locale } }) {
  if (locale === "ar") {
    return {
      title: "مركز الطالب السوداني | Sudanese Study Hub",
      description:
        "ارفع وحمّل ملفات PDF والمستندات والعروض التقديمية والمحاضرات المرئية — مرتبة حسب الدولة والجامعة والمرحلة الدراسية والفصل الدراسي للطلاب السودانيين حول العالم.",
    };
  }
  return {
    title: "Study Hub | Sudanese Study Hub - مركز الطالب السوداني",
    description:
      "Upload and download study materials — PDFs, documents, presentations and video lectures — organized by country, university, degree level, and semester for Sudanese students worldwide.",
  };
}

export default function StudyHubPage({ params: { locale } }) {
  return <StudyHubClient locale={locale} />;
}

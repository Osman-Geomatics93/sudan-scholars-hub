import { PomodoroRoom } from "./pomodoro-room";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (locale === "ar") {
    return {
      title: "غرفة دراسة بومودورو | مركز الطالب السوداني",
      description:
        "حافظ على تركيزك وإنتاجيتك مع جلسات دراسة محددة الوقت، أصوات محيطة، وعداد مباشر للطلاب.",
    };
  }
  return {
    title: "Pomodoro Study Room | Sudanese Study Hub",
    description:
      "Stay focused and productive with timed study sessions, ambient sounds, and a live student counter.",
  };
}

export default function PomodoroPage({ params: { locale } }: { params: { locale: string } }) {
  return <PomodoroRoom locale={locale} />;
}

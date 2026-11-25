export async function generateClientVoiceover(
  text: string,
  language: "id" | "en" | "id-ID" | "en-US" = "id"
): Promise<{ success: boolean; audioUrl: string }> {
  try {
    const langCode = language.startsWith("en") ? "en" : "id";
    const encoded = encodeURIComponent(text.slice(0, 200));
    // Direct audio stream URL accessible in browser without backend
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encoded}`;

    // Also trigger browser SpeechSynthesis for instant local speech if supported
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        const u = new SpeechSynthesisUtterance(text.slice(0, 200));
        u.lang = langCode === "en" ? "en-US" : "id-ID";
        u.rate = 1.0;
        window.speechSynthesis.speak(u);
      } catch (e) {
        // ignore
      }
    }

    return {
      success: true,
      audioUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      audioUrl: "",
    };
  }
}

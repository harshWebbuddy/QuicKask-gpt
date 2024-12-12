import langdetect from "langdetect";

export function cleanStringToSynthesis(str: string) {
  str = str
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(
      /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F900}-\u{1F9FF}|\u{1F1E0}-\u{1F1FF}|\u{1F200}-\u{1F2FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}]/gu,
      "",
    )
    .replace(/<div\s+class="date-chat".*?<\/div>/g, "")
    .replace(/\n/g, "");
  return str;
}

function internalSpeechSynthesis(
  utterances: SpeechSynthesisUtterance[],
  textParts: Array<string>,
  longText: string,
  endHandler: () => void,
) {
  // Read each piece of text sequentially
  function speakTextParts(index = 0, lang = "en-US", voice: any) {
    if (index < utterances.length) {
      const textToHighlight = textParts[index];
      const highlightIndex = longText.indexOf(textToHighlight);

      utterances[index].lang = lang;
      // Speak the text
      speechSynthesis.speak(utterances[index]);
      console.log(utterances[index].text);
      utterances[index].voice = voice;
      utterances[index].addEventListener("end", () => {
        // Remove the highlight
        speakTextParts(index + 1, lang, voice);
      });

      // Remove the highlight if speech synthesis is interrupted
    } else {
      endHandler();
    }
  }

  // Begin speak
  const lang = /[^\x00-\x7f]/.test(utterances[0].text) ? "zh-CN" : "en-US";
  const voice = speechSynthesis
    .getVoices()
    .find(
      (voice) =>
        voice.lang === lang ||
        (lang === "zh-CN" && voice.name === "Tian-Tian") ||
        (lang === "en-US" && voice.name === "Daniel"),
    ) as SpeechSynthesisVoice;
  // alert(voice.name + " is speaking!");
  speakTextParts(0, lang, voice);
}

export function doSpeechSynthesis(
  longText: string,
  /*voices: SpeechSynthesisVoice[], */ endHandler: () => void,
) {
  longText = cleanStringToSynthesis(longText);

  const maxLength = 20;
  const punctuationIndices = Array.from(longText.matchAll(/[,.?!、。]/g)).map(
    (match) => match.index || -1,
  );

  const textParts: Array<string> = [];
  let startIndex = 0;
  console.log(punctuationIndices);
  for (let i = 0; i < punctuationIndices.length; i++) {
    console.log("1");
    if (
      punctuationIndices[i] &&
      punctuationIndices[i]! - startIndex < maxLength
    ) {
      continue;
    }
    console.log(punctuationIndices[i] + 1);
    textParts.push(longText.substring(startIndex, punctuationIndices[i] + 1));
    startIndex = punctuationIndices[i] + 1;
  }
  if (startIndex < longText.length) {
    textParts.push(longText.substring(startIndex));
  }

  const utterances = textParts.map((textPart) => {
    const utterance = new SpeechSynthesisUtterance(textPart);
    // utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === OutC[0].google_voice) || null;

    // if (true /*!utterance.voice*/) {
    //     const backupVoice = voices.find(voice => voice.lang === utterance.lang);
    //     if (backupVoice) {
    //         utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === backupVoice.name) || null;
    //     }
    // }
    return utterance;
  });

  internalSpeechSynthesis(utterances, textParts, longText, endHandler);
}

export function stopSpeechSysthesis() {
  window.speechSynthesis.cancel();
}

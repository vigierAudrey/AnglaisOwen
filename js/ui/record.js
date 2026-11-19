// Micro : s'enregistrer pour se réécouter (jeu du perroquet).
// Rien n'est sauvegardé : l'enregistrement reste en mémoire le temps du jeu.

export const recordingAvailable = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder && window.isSecureContext);

/** Démarre un enregistrement ; renvoie une fonction stop() → Promise<Blob>. */
export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  rec.start();
  let stopped = null;
  return () =>
    (stopped ||= new Promise((ok) => {
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        ok(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
      };
      rec.stop();
    }));
}

/** Joue un enregistrement ; la promesse se résout à la fin. */
export function playBlob(blob) {
  return new Promise((ok) => {
    const url = URL.createObjectURL(blob);
    const a = new Audio(url);
    a.onended = a.onerror = () => {
      URL.revokeObjectURL(url);
      ok();
    };
    a.play().catch(() => ok());
  });
}

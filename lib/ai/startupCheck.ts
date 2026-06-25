import { validateGeminiKey } from "./validateGemini";

let aiStatus: any = {
  ok: false
};

export async function initAI() {
  aiStatus = await validateGeminiKey();

  console.log("========== GEMINI CHECK ==========");
  console.log(aiStatus);
  console.log("==================================");
}

export function getAIStatus() {
  return aiStatus;
}

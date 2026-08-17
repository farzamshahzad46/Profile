// Vercel serverless function. Runs on the server, not in the browser -
// this is the ONLY place the Gemini API key should ever live. Set
// GEMINI_API_KEY in your Vercel project's Environment Variables (Settings ->
// Environment Variables), not in any file that ships to the client.
//
// Model choice: flash-lite carries the most generous free-tier quota.
// Google retires model names fairly often - if this starts returning a 404
// saying the model is no longer available, the error message itself names the
// replacement to use. Current free-tier rows are listed at
// https://ai.google.dev/gemini-api/docs/pricing
const MODEL = "gemini-3.5-flash-lite";

// Edit this to keep it accurate as your projects/skills change - the
// assistant only knows what's written here, it doesn't read the rest of
// your site's content.
const PROFILE_CONTEXT = `
You are a helpful assistant embedded on Farzam Shahzad's personal portfolio website.
Answer questions from visitors (likely recruiters or hiring managers) about Farzam's
skills, tech stack, experience, and projects. Be concise, direct, and factual - do not
invent details, metrics, or projects that aren't listed below. If asked something you
don't have information on, say so plainly and suggest they contact Farzam directly at
FarzamShahzad27@gmail.com.

BACKGROUND
- Recent graduate: Bachelor of Computing and Data Science, University of Management and
  Technology (UMT), Lahore. Coursework and final year project complete; formal degree
  conferral is scheduled for November 2026.
- Currently job searching for AI Engineer, Machine Learning Engineer, Data Scientist, and
  Generative AI roles, primarily in Lahore, with some interest in international roles
  (e.g. Dubai).
- Completed an internship at the Artificial Intelligence Community of Pakistan (AICP).

CORE SKILLS
- Languages/tools: Python, SQL, Power BI
- Machine learning and data science fundamentals
- NLP, RAG (retrieval-augmented generation) pipelines, generative AI tooling
- LangChain, FAISS, embeddings, vector search, hybrid search (semantic + BM25)

PROJECTS
- QanoonDost: a RAG portfolio project over Pakistani legal texts (Pakistan Penal Code and
  Code of Criminal Procedure), using hybrid search combining semantic and BM25 retrieval,
  with custom PDF extraction achieving roughly 85-90% section coverage.
- Medical Assistant Chatbot: an AI tool that gives basic health advice based on symptoms
  and generates a downloadable PDF prescription/next-steps document.
- Deepfake Voice Detection: a Streamlit tool that classifies whether an uploaded voice
  recording is real or AI-generated, using MFCC audio features (Librosa), Whisper for
  transcription, TF-IDF on the transcript, and an XGBoost classifier.
- Highway Vehicle Detection: car detection in images/video using a custom-trained Haar
  Cascade classifier in OpenCV - a classical computer vision approach, not deep learning.
- Stock Price Forecasting: an LSTM time-series model in TensorFlow/Keras for stock trend
  forecasting.
- Various earlier coursework/portfolio projects touching document Q&A / RAG search.

LINKS
- GitHub: github.com/farzamshahzad46
- Email: FarzamShahzad27@gmail.com

Keep answers short (2-4 sentences unless the visitor asks for detail). Speak about Farzam
in the third person, since you are a website assistant, not Farzam himself.
`.trim();

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        "Server is missing GEMINI_API_KEY. Set it in your Vercel project's Environment Variables.",
    });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
  const message: unknown = body.message;
  const history: unknown = body.history;

  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "Missing 'message' in request body." });
    return;
  }

  // Basic guardrails: cap message length and history size so a malicious
  // caller can't run up token costs against your free-tier key.
  const trimmedMessage = message.slice(0, 1000);
  const safeHistory: ChatMessage[] = Array.isArray(history)
    ? history
      .filter(
        (m): m is ChatMessage =>
          m &&
          (m.role === "user" || m.role === "model") &&
          Array.isArray(m.parts) &&
          typeof m.parts[0]?.text === "string"
      )
      .slice(-10)
      .map((m) => ({ role: m.role, parts: [{ text: m.parts[0].text.slice(0, 1000) }] }))
    : [];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: PROFILE_CONTEXT }] },
          contents: [...safeHistory, { role: "user", parts: [{ text: trimmedMessage }] }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.4,
          },
        }),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      res.status(502).json({ error: "Upstream Gemini API error", detail });
      return;
    }

    const data = await response.json();
    const reply: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
      "Sorry, I couldn't generate a response just now - try again in a moment.";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach the AI service." });
  }
}

import { Router, type IRouter } from "express";
import { SendChatMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are an AI learning assistant for IlmAI — a premium online learning platform offering English and Arabic language courses. 
You help students with:
- Course information (English Course and Arabic Course are available)
- Payment help (EVC Plus: +252 61 2035767, Somtel: +252 65 6042512, E-pir: 0979695586, WhatsApp for confirmation: +252 65 6042512)
- Learning questions about English and Arabic grammar, vocabulary, and exercises
- Platform navigation and progress tracking
Be concise, helpful, and encouraging. If asked about payment, explain the manual payment process clearly.`;

router.post("/chat", async (req, res): Promise<void> => {
  const body = SendChatMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const { message, history } = body.data;

  // Use OpenAI-compatible API if available, otherwise return helpful fallback
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;

  if (!apiKey) {
    // Intelligent fallback responses
    const lower = message.toLowerCase();
    let reply = "I'm here to help you learn! Ask me about our English or Arabic courses, payment options, or any language questions.";

    if (lower.includes("payment") || lower.includes("pay") || lower.includes("price") || lower.includes("lacag")) {
      reply = "To enroll in a course, you can pay via:\n• EVC Plus: +252 61 2035767\n• Somtel: +252 65 6042512\n• E-pir: 0979695586\n\nAfter payment, send a screenshot via WhatsApp to +252 65 6042512 and you'll receive your access code.";
    } else if (lower.includes("english") || lower.includes("course")) {
      reply = "Our English Course covers all levels from beginner to advanced, with video lessons, text content, quizzes, and a certificate upon completion. Use an access code to unlock your course after payment.";
    } else if (lower.includes("arabic") || lower.includes("carabi")) {
      reply = "Our Arabic Course teaches Modern Standard Arabic and conversational skills through structured lessons with video content, exercises, and quizzes. Complete all lessons to earn your certificate.";
    } else if (lower.includes("code") || lower.includes("access")) {
      reply = "Your access code unlocks one course. Enter it on the Access Code page or on the course detail page. Codes are provided after payment confirmation via WhatsApp.";
    } else if (lower.includes("certificate")) {
      reply = "You'll receive a downloadable PDF certificate automatically when you complete all lessons in a course. Visit your Dashboard to view and download your certificates.";
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("salaam") || lower.includes("marhaba")) {
      reply = "Hello! Welcome to IlmAI. I'm your learning assistant. How can I help you today? You can ask me about our courses, payment options, or any language learning questions.";
    }

    res.json({ reply });
    return;
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = (await response.json()) as any;
    const reply = data.choices?.[0]?.message?.content ?? "I'm unable to respond right now. Please try again.";
    res.json({ reply });
  } catch {
    res.json({ reply: "I'm having trouble connecting right now. For immediate help, please contact us via WhatsApp at +252 65 6042512." });
  }
});

export default router;

import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export const config = {
  runtime: "nodejs",
  maxDuration: 30,
};

const SYSTEM_PROMPT = `أنت متخصص في كتابة السير الذاتية. مهمتك إعادة صياغة الملخص المهني بأسلوب احترافي يناسب السيرة الذاتية.

القواعد:
- لا تغيّر المعنى الأساسي للنص
- يمكنك إضافة جمل احترافية بسيطة تنسجم مع سياق ما كتبه الشخص، مثل ذكر الحرص على التطوير أو العمل بفريق أو تحقيق النتائج — لكن فقط إذا كانت منطقية بناءً على ما كُتب
- لا تُطوّل النص أكثر من اللازم (3 جمل كحد أقصى)
- استخدم كلمات بسيطة ومباشرة، تجنب المصطلحات المعقدة
- اكتب بضمير المتكلم (أنا)، مثال: أمتلك خبرة في... / أسعى إلى... / أتميز بـ...
- اكتب باللغة العربية الفصحى البسيطة
- أرجع النص المحسّن فقط بدون أي مقدمة أو تعليق`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for safety (same-origin won't need it)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY env var is not set");
    return res.status(500).json({ error: "خدمة الذكاء الاصطناعي غير مهيّأة" });
  }

  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as { text?: string };
  const text = body?.text;

  if (!text || text.trim().length < 5) {
    return res.status(400).json({ error: "النص قصير جداً" });
  }

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL,
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text.trim() },
      ],
      max_tokens: 400,
    });

    const improved = completion.choices[0]?.message?.content?.trim();
    if (!improved) {
      return res.status(500).json({ error: "فشل في تحسين النص" });
    }

    return res.status(200).json({ improved });
  } catch (err) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: "حدث خطأ في الخدمة. حاول مجدداً." });
  }
}

import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

router.post("/improve-summary", async (req, res) => {
  const { text } = req.body as { text?: string };

  if (!text || text.trim().length < 5) {
    res.status(400).json({ error: "النص قصير جداً" });
    return;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `أنت متخصص في كتابة السير الذاتية. مهمتك إعادة صياغة الملخص المهني بأسلوب احترافي يناسب السيرة الذاتية.

القواعد الصارمة:
- لا تغيّر المعنى أو تضف معلومات غير موجودة في النص الأصلي
- لا تُطوّل النص، بل اجعله مختصراً وموجزاً (3 جمل كحد أقصى)
- استخدم كلمات بسيطة وواضحة، تجنب المصطلحات المعقدة
- اكتب بضمير المتكلم (أنا)، مثال: أمتلك خبرة في... / أسعى إلى... / أتميز بـ...
- اكتب باللغة العربية الفصحى البسيطة
- أرجع النص المحسّن فقط بدون أي مقدمة أو تعليق`,
      },
      {
        role: "user",
        content: text.trim(),
      },
    ],
    max_tokens: 400,
  });

  const improved = completion.choices[0]?.message?.content?.trim();
  if (!improved) {
    res.status(500).json({ error: "فشل في تحسين النص" });
    return;
  }

  res.json({ improved });
});

export default router;

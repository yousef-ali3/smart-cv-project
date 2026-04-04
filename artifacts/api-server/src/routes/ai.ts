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
        content: `أنت خبير في كتابة السير الذاتية الاحترافية. مهمتك هي إعادة صياغة الملخص المهني الذي يكتبه المستخدم بطريقة احترافية تناسب السيرة الذاتية.
القواعد:
- اكتب بضمير الغائب (مثال: يتمتع بخبرة واسعة في...)
- اجعل النص مختصراً وقوياً (3-4 جمل كحد أقصى)
- ابرز نقاط القوة والمهارات والأهداف المهنية
- استخدم مصطلحات احترافية مناسبة لسوق العمل
- اكتب باللغة العربية الفصحى
- لا تضف معلومات غير موجودة في النص الأصلي
- أرجع النص المحسّن فقط بدون أي مقدمة أو شرح`,
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

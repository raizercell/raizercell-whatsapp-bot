
require('dotenv').config();
const { create, Client } = require('venom-bot');
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

create().then((client) => start(client));

function start(client) {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      const userMessage = message.body;

      if (userMessage.toLowerCase().includes("humano")) {
        await client.sendText(message.from, "Certo! Encaminhando para um atendente humano agora mesmo.");
        return;
      }

      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
          },
          {
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const aiReply = response.data.choices[0].message.content;
        await client.sendText(message.from, aiReply);
      } catch (error) {
        console.error("Erro ao consultar a IA:", error.message);
        await client.sendText(message.from, "Desculpe, houve um erro ao buscar a resposta.");
      }
    }
  });
}

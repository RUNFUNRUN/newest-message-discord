import { Hono } from 'hono';
import { client } from './discord';

client.login(process.env.DISCORD_TOKEN);

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/message', async (c) => {
  const date = new Date().toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  console.log(`${date} :: GET :: /message`);

  try {
    const channelId = process.env.DISCORD_CHANNEL_ID;
    if (!channelId) {
      return c.json({ message: 'channelId is not found.' }, 500);
    }
    const channel = client.channels.cache.get(channelId);

    if (!channel) {
      return c.json({ message: 'channel is undefined' }, 500);
    }
    if (!channel.isTextBased()) {
      return c.json({ message: 'channel is not text based' }, 500);
    }
    const messages = await channel.messages.fetch({ limit: 1 });
    const lastMessage = messages.first();
    if (lastMessage) {
      return c.json({ message: lastMessage.content });
    }
    return c.json({ message: undefined });
  } catch (e) {
    return c.json({ message: 'Internal Server Error' }, 500);
  }
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};

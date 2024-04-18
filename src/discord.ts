import { Client, Events, GatewayIntentBits } from 'discord.js';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, (c: Client) => {
  console.log(`Ready! Logged in as ${c.user?.tag}`);
});

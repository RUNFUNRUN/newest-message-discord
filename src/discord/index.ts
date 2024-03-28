import { Client, Events, GatewayIntentBits } from 'discord.js';
import type { ChatInputCommandInteraction, Interaction } from 'discord.js';
import { commands } from './commands';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, (c: Client) => {
  console.log(`Ready! Logged in as ${c.user?.tag}`);
  c.application?.commands
    .set(commands.map((command) => command.data))
    .then((commands) => {
      console.log('Commands set.');
      commands.map((command) => {
        console.log(`name: ${command.name}`);
      });
    });
});

client.addListener(
  Events.InteractionCreate,
  async (interaction: Interaction) => {
    if (!interaction.isCommand()) {
      return;
    }
    const commandName = interaction.commandName;
    const command = commands.find(
      (command) => command.data.name === commandName,
    );
    if (!command) {
      console.log('commands not found');
      return;
    }
    try {
      await command.execute(interaction as ChatInputCommandInteraction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
);

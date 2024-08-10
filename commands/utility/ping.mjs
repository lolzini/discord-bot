import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping!")
    .toJSON(),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

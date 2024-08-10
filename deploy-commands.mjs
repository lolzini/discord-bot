import dotenv from "dotenv";
dotenv.config();

import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { filterJsFiles } from "./utils.mjs";

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(filterJsFiles);

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = await import(pathToFileURL(filePath).href);

    if ("data" in command && "execute" in command) {
      commands.push(command.data);
    } else {
      console.info(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(BOT_TOKEN);

try {
  console.info(
    `Started refreshing ${commands.length} application (/) commands.`
  );

  const data = await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.info(
    `Successfully reloaded ${data.length} application (/) commands.`
  );
} catch (error) {
  console.error(error);
}

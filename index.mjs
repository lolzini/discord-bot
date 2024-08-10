import dotenv from "dotenv";
dotenv.config();

import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { filterJsFiles } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

await loadCommands();

await loadEvents();

client.login(process.env.BOT_TOKEN);

// ----------------------- Functions

async function loadCommands() {
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(filterJsFiles);

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const { default: command } = await import(pathToFileURL(filePath).href);

      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      } else {
        console.info(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}

async function loadEvents() {
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs.readdirSync(eventsPath).filter(filterJsFiles);

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const eventModule = await import(pathToFileURL(filePath).href);

    if (eventModule.default?.once) {
      client.once(eventModule.default.name, (...args) =>
        eventModule.default.execute(...args)
      );
    } else {
      client.on(eventModule.default.name, (...args) =>
        eventModule.default.execute(...args)
      );
    }
  }
}

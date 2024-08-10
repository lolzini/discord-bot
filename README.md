# discord-bot

> Este código es una versión de la guía que puedes encontrar en [este enlace](https://discordjs.guide/#before-you-begin).
> ⚠️ Utiliza `import` en lugar de `require` y archivos `.mjs` en lugar de archivos `.js`.

## Instrucciones

### Para correr el bot

Agregar un archivo `.env` con las siguientes variables:

`BOT_TOKEN` = token de tu bot
`GUILD_ID` = id de tu servidor de Discord
`CLIENT_ID` = id del cliente de tu bot (Discord Developer Portal)

### Agregar comandos

Para agregar comandos, debes crear un archivo `.mjs` en la carpeta `src/commands` con la siguiente estructura:

```js
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("NOMBRE")
    .setDescription("DESCRIPCIÓN")
    .toJSON(),
  async execute(interaction) {
    // Código para ejecutar el comando
  },
};
```

### Registrar comandos

Para registrar los comandos en el servidor debemos ejecutar: `node deploy-commands.mjs`.

Esto convertirá los archivos dentro de `commands` en commandos Slash (`/`) de Discord.

### Ejecutar el bot

Para levantar el bot debemos ejecutar `node .`.

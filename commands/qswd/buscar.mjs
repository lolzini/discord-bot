import { hyperlink, SlashCommandBuilder } from "discord.js";
import Fuse from "fuse.js";

let searchData;
let fuseInstance;

const FUSE_OPTIONS = {
  includeScore: true,
  shouldSort: true,
  keys: [
    { name: "data.title", weight: 1 },
    { name: "data.tags", weight: 0.75 },
    { name: "slug", weight: 0.5 },
    { name: "body", weight: 0.3 },
  ],
};

const DATA_URL = "https://quieroserweb.dev/buscar/data.json";

export default {
  data: new SlashCommandBuilder()
    .setName("buscar")
    .setDescription(
      "Este comando busca en el blog un artículo relacionado con el término que se le indique."
    )
    .addStringOption((option) =>
      option
        .setName("búsqueda")
        .setDescription("El término que se quiere buscar.")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction) {
    const search = interaction.options.getString("búsqueda");

    const results = await fetchSearchResults(search);

    const articleUrls = results
      .map((result) => ({
        title: result.item.data.title,
        url: `https://quieroserweb.dev/blog/${result.item.slug}`,
        score: result.score,
      }))
      .sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

    let message = "";

    if (articleUrls.length === 0) {
      message = "No se encontró nada.";
    } else {
      message = `${articleUrls.length} resultados encontrados:\n`;
      articleUrls.forEach((a) => {
        message += "<" + hyperlink(a.title, a.url) + ">" + "\n";
      });
    }

    await interaction.reply(message);
  },
};

export async function fetchSearchResults(search) {
  if (search.length === 0) return;

  if (!searchData) {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) {
        throw new Error("Algo salió mal. Intenta después.");
      }
      const data = await res.json();
      searchData = data;
    } catch (error) {
      console.error(error);
    }
  }

  if (searchData && !fuseInstance) {
    fuseInstance = new Fuse(searchData, FUSE_OPTIONS);
  }

  if (!fuseInstance) return;

  const results = fuseInstance.search(search);

  return results;
}

#!/usr/bin/env node

import fs from "fs";
import colors from "colors/safe";
import path from "path";
import { getDB } from "./steps/getDB";
import { getDBPath } from "./steps/getDBPath";
import { selectBooks } from "./steps/selectBooks";
import { selectLanguage } from "./steps/selectLanguage";
import { deleteBooks } from "./steps/deleteBooks";
import { selectDeckName } from "./steps/selectDeckName";
import { Lookup } from "kindle-vocab-tools";
import { generateDeck } from "./steps/generateDeck";
import { DeckType, selectDeckType } from "./steps/selectDeckType";
import { selectDecksPath } from "./steps/selectDecksPath";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const rootPath = __dirname;

async function run() {
  if (!process.env.WORDS_API_KEY) {
    console.error("Provide WORDS_API_KEY env variable.");
    return;
  }

  console.log(
    colors.yellow(
      `Please ensure you have Google Cloud ${colors.bold(
        "Text-to-Speech"
      )} and ${colors.bold("Translation")} API's enabled and ${colors.bold(
        "gcloud"
      )} CLI installed and configured:`
    )
  );
  console.log(
    colors.yellow(`https://www.npmjs.com/package/@google-cloud/text-to-speech`)
  );
  console.log(
    colors.yellow(`https://www.npmjs.com/package/@google-cloud/translate`)
  );
  console.log(colors.yellow(`https://cloud.google.com/sdk/gcloud`));

  const pathToDB = await getDBPath();

  const db = await getDB(pathToDB);

  const books = await selectBooks(await db.getAllBooks());

  if (!books) {
    console.log(
      colors.yellow("You don't have any book at the Vocabulary Builder")
    );
    return;
  }

  const decks = new Map<string, { name: string; lang: string; type: DeckType }>();
  const lookups = new Map<string, Lookup[]>();

  for (const book of books) {
    const deckKey = randomUUID();

    const lang = await selectLanguage(`Select language of '${book.title}'`);
    book.lang = lang.value;
    decks.set(deckKey, { name: book.title, lang: lang.value, type: "basic" });

    let bookLookups: Lookup[] = [];
    try {
      bookLookups = await db.getLookupsByBookId(book.id);
    } catch {
      /* empty */
    }

    if (!lookups.has(deckKey)) {
      lookups.set(deckKey, []);
    }
    lookups.get(deckKey)?.push(...bookLookups);
  }

  for (const [key, { name, type, lang }] of decks.entries()) {
    const deckName = await selectDeckName(name);
    const deckType = await selectDeckType(type);

    decks.set(key, { name: deckName, type: deckType, lang });
  }

  const deleteBooksAfterExport = await deleteBooks();

  const outLang = await selectLanguage(`Select language for translation`);

  const decksPath = await selectDecksPath();

  for (const [key, { name, type, lang }] of decks.entries()) {
    console.log(`Generating '${name}' deck...`);
    try {
      const deck = await generateDeck({
        deckName: name,
        deckType: type,
        inLang: lang,
        lookups: lookups.get(key) ?? [],
        outLang: outLang.value,
        rootPath,
      });
      fs.writeFileSync(path.join(decksPath, `${name}.apkg`), deck, "binary");
      console.log(colors.green("Done!"));
    } catch (e: any) {
      console.log("deck gen error::", e?.message, JSON.stringify(e));
    }
  }

  if (deleteBooksAfterExport) {
    console.log("Removing books from Kindle Vocabulary Builder...");
    for (const book of books) {
      await db.deleteBookWithLookups(book.id);
    }
    console.log(colors.green("Done!"));
  }
}

run();

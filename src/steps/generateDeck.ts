import { Lookup } from "kindle-vocab-tools";
import fs from "fs";
import path from "path";
import ProgressBar from "progress";
import { v4 as uuidv4 } from "uuid";
import Mustache from "mustache";
import { getSpeech } from "./getSpeech";
import { getTranslate } from "./getTranslate";
import { getDeck } from "./getDeck";
import { getDefinition } from "./getDefinition";
import { DeckType } from "./selectDeckType";

interface GenerateDeck {
  deckName: string;
  deckType: DeckType;
  lookups: Lookup[];
  inLang: string;
  outLang: string;
  rootPath: string;
}

async function generateDeck({
  deckName,
  deckType,
  lookups,
  inLang,
  outLang,
  rootPath,
}: GenerateDeck) {
  const progress = new ProgressBar(":bar :percent", {
    total: lookups.length,
  });

  const deck = getDeck(deckName, rootPath);

  for (const lookup of lookups) {
    const wordSpeech = await getSpeech(lookup.word, inLang);
    const wordSpeechName = `${uuidv4()}.mp3`;
    const usageSpeech = await getSpeech(lookup.usage, inLang);
    const usageSpeechName = `${uuidv4()}.mp3`;

    const usageTranslate = await getTranslate(lookup.usage, inLang, outLang);
    const stemTranslate = await getTranslate(lookup.stem, inLang, outLang);
    const definitions = await getDefinition(lookup.stem);

    const formattedUsage = getFormattedUsage(
      lookup.usage,
      lookup.word,
      deckType
    );

    const front = Mustache.render(
      fs.readFileSync(path.join(rootPath, "assets/front.html")).toString(),
      {
        word: deckType === "cloze" ? undefined : lookup.word,
        audioWordFilePath: deckType === "cloze" ? undefined : wordSpeechName,
        usage: formattedUsage,
      }
    );

    const back = Mustache.render(
      fs.readFileSync(path.join(rootPath, "assets/back.html")).toString(),
      {
        stem: lookup.stem,
        bookTitle: lookup.book_title,
        usage: formattedUsage,
        audioUsageFilePath: usageSpeechName,
        usageTranslate,
        stemTranslate,
        definitions: definitions.results,
        videoUsage: `https://www.playphrase.me/#/search?q=${lookup.stem}`,
      }
    );

    deck.addMedia(wordSpeechName, wordSpeech);
    deck.addMedia(usageSpeechName, usageSpeech);

    deck.addCard(front, back);
    progress.tick();
  }

  return await deck.save();
}

function getFormattedUsage (usage: string, word: string, deckType: DeckType) {
  if (deckType === "basic") {
    return usage.replace(
      new RegExp("(" + word + ")", "gi"),
      "<strong><em>$1</em></strong>"
    );
  }

  if (deckType === "cloze") {
    return usage.replace(
      new RegExp("(" + word + ")", "gi"),
      `{{c1::$1::${word.length}}}`
    );
  }
}

export { generateDeck };

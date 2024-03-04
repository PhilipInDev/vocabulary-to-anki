import prompts from "prompts";

const choices = [
  { title: "Basic", value: "basic" },
  { title: "Cloze deletion", value: "cloze" },
] as const;

type DeckType = (typeof choices)[number]["value"];

async function selectDeckType(defaultType?: DeckType) {
  const { type: result } = await prompts({
    type: "select",
    name: "type",
    message: "Choose deck type",
    initial: choices.findIndex(({ value }) => value === defaultType),
    choices,
  });

  return result as DeckType;
}

export { selectDeckType };
export type { DeckType };

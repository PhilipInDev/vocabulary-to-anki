import axios from "axios";

type DefinitionResponseType = {
  word: string;
  results: {
    definition: string;
    partOfSpeech: string;
    synonyms: string[];
    examples: string[];
  }[];
  pronunciation: {
    all: string;
  };
};

const getDefinition = async (word: string) => {
  try {
    const res = await axios.request({
      method: "GET",
      url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
      headers: {
        "X-RapidAPI-Key": process.env.WORDS_API_KEY,
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
      } as any,
    });

    return res.data as DefinitionResponseType;
  } catch (e: unknown) {
    return {
      word,
      results: [],
      pronunciation: {
        all: "",
      },
    } as DefinitionResponseType;
  }
};

export { getDefinition };

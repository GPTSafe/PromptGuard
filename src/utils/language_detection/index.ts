import lande from "lande";

type LandeOuput = Array<[string, number]>;
type detectLanguageOutput = string[];

export async function containsLanguages(
  prompt: string,
  languages: string[],
): Promise<boolean> {
  const detectedLanguages: detectLanguageOutput = [];

  // lande returns a sorted list of detected languages and their probabilities.
  // for now, we're selecting all languages with a probability greater than 80%
  // this may need to be tuned later
  const landeOuput: LandeOuput = lande(prompt);

  for (const lang of landeOuput) {
    if (lang[1] > 0.8) detectedLanguages.push(lang[0]);
    else break;
  }

  for (const lang of detectedLanguages) {
    if (languages.includes(lang)) return true;
  }

  return false;
}

// export async function validateLanguageList(list: string[]): Promise<boolean> {
//   //foo
//   return true;
// }

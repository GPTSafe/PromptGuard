import lande from "lande";

type LandeOuput = Array<[string, number]>;
type detectLanguageOutput = string[];

export async function detectLanguage(
  prompt: string
): Promise<detectLanguageOutput> {
  const output: detectLanguageOutput = [];

  // lande returns a sorted list of detected languages and their probabilities.
  // for now, we're selecting all languages with a probability greater than 80%
  // this may need to be tuned later
  const languages: LandeOuput = lande(prompt);
  for (const lang of languages) {
    if (lang[1] > 0.8) output.push(lang[0]);
    else break;
  }

  // if for some reason lande is not able to detect any languages with >80% probability
  // return undefined as 'und' instead
  if (output.length === 0) output.push('und');

  return output;
}

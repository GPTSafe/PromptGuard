type DenyList = string[];

const attackDenyList: DenyList = [
  "ignore above",
  "ignore the above",
  "ignore previous instructions",
  "ignore the previous instructions",
  "ignore above instructions",
  "ignore instructions above",
  "ignore the above instructions",
  "ignore above directions",
  "ignore directions above",
  "ignore the above directions",
  "ignore the previous directions",
  "ignore previous directions",
];

export async function containsKnownAttack(prompt: string): Promise<boolean> {
  prompt = prompt.toLocaleLowerCase();

  for (const attack of attackDenyList) {
    if (prompt.includes(attack)) {
      return true;
    }
  }

  return false
}
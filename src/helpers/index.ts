export async function containsDenyListItems(
  prompt: string,
  denyList: string[]
): Promise<boolean> {
  try {
    prompt = prompt.toLowerCase();
  } catch {
    throw new Error("prompt could not be converted to lower case");
  }

  for (const item of denyList) {
    if (prompt.includes(item.toLowerCase())) {
      return true;
    }
  }

  return false;
}

type DenyList = string[];

export async function containsDenyListItems(
  prompt: string,
  userDenyList: DenyList
): Promise<boolean> {
  prompt = prompt.toLowerCase();

  if (userDenyList.length === 1 && userDenyList[0] === '') return false;

  // TODO implement fuzzy matching
  for (const item of userDenyList) {
    if (prompt.includes(item.toLowerCase())) {
      return true;
    }
  }

  return false;
}

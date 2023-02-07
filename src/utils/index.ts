type DenyList = string[];

export async function containsDenyListItems(
  prompt: string,
  userDenyList: DenyList,
  ignoreDefaultDenyList: boolean
): Promise<boolean> {
  try {
    prompt = prompt.toLowerCase();
  } catch {
    throw new Error("prompt could not be converted to lower case");
  }

  const defaultDenyList: DenyList = [
    "ignore previous instructions",
    "ignore above instructions",
  ];

  let denyList: DenyList = [""];

  if (userDenyList.length > 1 || userDenyList[0] !== "") {
    if (!ignoreDefaultDenyList) {
      denyList = defaultDenyList.concat(userDenyList);
    }
    if (ignoreDefaultDenyList) {
      denyList = userDenyList;
    }
  }

  if (userDenyList.length === 1 && userDenyList[0] === "") {
    if (!ignoreDefaultDenyList) {
      denyList = defaultDenyList;
    }
  }

  // TODO implement fuzzy matching
  for (const item of denyList) {
    if (prompt.includes(item.toLowerCase())) {
      return true;
    }
  }

  return false;
}

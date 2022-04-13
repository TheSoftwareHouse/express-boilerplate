export const camelize = (text: string): string => {
  const camelizeText = text.toLowerCase().replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return camelizeText.substring(0, 1).toLowerCase() + camelizeText.substring(1);
};

export const capitalizeFirst = (str: string) => {
  return str.match("^[a-z]") ? str.charAt(0).toUpperCase() + str.substring(1) : str;
};

export const lowerFirst = (str: string) => {
  return str.match("^[A-Z]") ? str.charAt(0).toLowerCase() + str.substring(1) : str;
};

// profile.project = profileProject
export const tableAliasName = (name: string, separator = ".") => {
  const parts = name.split(separator);
  let aliasName = "";
  parts.forEach((part, index) => {
    if (index === 0) {
      aliasName += lowerFirst(part);
    } else {
      aliasName += capitalizeFirst(part);
    }
  });
  return aliasName;
};

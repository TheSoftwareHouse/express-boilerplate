export const camelize = (text: string): string => {
  const camelizeText = text.toLowerCase().replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return camelizeText.substring(0, 1).toLowerCase() + camelizeText.substring(1);
};

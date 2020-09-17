export const restrictFromProduction = (env: string | undefined) => (value: any) => {
  if (env === "production") {
    return undefined;
  }

  return value;
};

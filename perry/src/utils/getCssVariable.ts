function getCssVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

export { getCssVariable };
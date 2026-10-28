const STANDARD_ORDER: Record<string, number> = {
  // Extra smalls
  "5xs": 1,
  "4xs": 2,
  "3xs": 3,
  "xxxs": 3,
  "2xs": 4,
  "xxs": 4,
  "xs": 5,
  "extra small": 5,

  // Standard Alpha
  "s": 10,
  "small": 10,
  "m": 20,
  "med": 20,
  "medium": 20,
  "l": 30,
  "large": 30,
  "xl": 40,
  "extra large": 40,

  // Plus Sizes
  "xxl": 50,
  "2xl": 50,
  "xxxl": 60,
  "3xl": 60,
  "4xl": 70,
  "5xl": 80,
  "6xl": 90,

  // Belt / Gi Rank Codes
  "000": 1,
  "00": 2,
  "0": 3,

  // Universal
  "os": 998,
  "one size": 998,
  "standard": 999,
};

export function sortSizes(sizes: string[]): string[] {
  if (!sizes || sizes.length <= 1) return sizes || [];

  return [...sizes].sort((a, b) => {
    const cleanA = a.trim().toLowerCase();
    const cleanB = b.trim().toLowerCase();

    const rankA = STANDARD_ORDER[cleanA];
    const rankB = STANDARD_ORDER[cleanB];

    if (rankA !== undefined && rankB !== undefined) {
      return rankA - rankB;
    }

    if (rankA !== undefined) return -1;
    if (rankB !== undefined) return 1;

    // Check for age patterns like 4-5Y, 6-7Y
    const matchAgeA = cleanA.match(/^(\d+)/);
    const matchAgeB = cleanB.match(/^(\d+)/);
    if (matchAgeA && matchAgeB && (cleanA.includes("y") || cleanA.includes("yr"))) {
      return parseInt(matchAgeA[1], 10) - parseInt(matchAgeB[1], 10);
    }

    // Check if numeric (e.g. 120, 130, 140, 150 or 28, 30, 32 or 7, 8, 9)
    const numA = parseFloat(cleanA);
    const numB = parseFloat(cleanB);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }

    return cleanA.localeCompare(cleanB, undefined, { numeric: true });
  });
}

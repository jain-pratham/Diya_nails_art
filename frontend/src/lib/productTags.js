export const PRODUCT_TAG_GROUPS = [
  {
    title: "Shop By Category",
    key: "category",
    options: [
      { label: "Best Sellers", value: "best-sellers" },
      { label: "French", value: "french" },
      { label: "Ombre", value: "ombre" },
      { label: "Casual", value: "casual" },
      { label: "Toe Nails", value: "toe-nails" },
    ],
  },
  {
    title: "Shop By Occasion",
    key: "occasion",
    options: [
      { label: "Casual Nails", value: "casual-nails" },
      { label: "Party Nails", value: "party-nails" },
      { label: "Wedding Nails", value: "wedding-nails" },
      { label: "Formal Nails", value: "formal-nails" },
      { label: "Holiday Nails", value: "holiday-nails" },
    ],
  },
  {
    title: "Shop By Length",
    key: "length",
    options: [
      { label: "Short Nails", value: "short" },
      { label: "Medium Nails", value: "medium" },
      { label: "Long Nails", value: "long" },
    ],
  },
  {
    title: "Shop By Shape",
    key: "shape",
    options: [
      { label: "Coffin Nails", value: "coffin" },
      { label: "Stiletto Nails", value: "stiletto" },
      { label: "Square Nails", value: "square" },
      { label: "Round Nails", value: "round" },
      { label: "Almond Nails", value: "almond" },
      { label: "Ballerina Nails", value: "ballerina" },
    ],
  },
  {
    title: "Shop By Color",
    key: "color",
    options: [
      { label: "Pink", value: "pink" },
      { label: "Red", value: "red" },
      { label: "Pastel", value: "pastel" },
      { label: "Gold", value: "gold" },
      { label: "Nude", value: "nude" },
      { label: "Other", value: "other-color" },
    ],
  },
  {
    title: "Shop By Texture",
    key: "finish",
    options: [
      { label: "Matte Nails", value: "matte" },
      { label: "Glossy Nails", value: "glossy" },
      { label: "Glitter Nails", value: "glitter" },
    ],
  },
];

export const ALL_PRODUCT_TAGS = PRODUCT_TAG_GROUPS.flatMap((group) =>
  group.options.map((option) => option.value)
);

export const tagLabelMap = PRODUCT_TAG_GROUPS.reduce((acc, group) => {
  group.options.forEach((option) => {
    acc[option.value] = option.label;
  });
  return acc;
}, {});

export const normalizeTag = (tag) => String(tag || "").trim().toLowerCase();

export const tagDisplayName = (tag) => {
  const normalized = normalizeTag(tag);
  if (tagLabelMap[normalized]) {
    return tagLabelMap[normalized];
  }
  return normalized
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

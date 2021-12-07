export type AttributeFlags = Record<string, number>;

export type AttributeFilters = {
  $all?: number;
} & Record<string, number>;

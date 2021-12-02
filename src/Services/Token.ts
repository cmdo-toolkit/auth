import type { TokenData } from "../Types/Token";

export type Token<Data extends TokenData = TokenData> = {
  decode(value: string): Promise<Data>;
};

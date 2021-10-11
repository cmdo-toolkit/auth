import { Container, Token } from "cmdo-inverse";

import { Store } from "./Services/Store";
import { Token as AuthToken } from "./Services/Token";

export const container = new Container<{
  Store: Token<{ new (): Store }, Store>;
  Token: Token<{ new (value: string): AuthToken }, AuthToken>;
}>();

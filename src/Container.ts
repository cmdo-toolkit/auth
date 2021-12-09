import { Container, Token } from "cmdo-inverse";

import { Database } from "./Services/Database";
import { Token as AuthToken } from "./Services/Token";

export const container = new Container<{
  Database: Token<{ new (): Database }, Database>;
  Token: Token<{ new (): AuthToken }, AuthToken>;
}>();

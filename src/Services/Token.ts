/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

//#region

export type TokenData = {
  auditor: string;
};

//#endregion

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

//#region

class DataAccessError extends Error {
  public readonly type = "DataAccessError";

  constructor() {
    super("Access Token Violation: Failed to access token data, token has not been decoded");
  }
}

//#endregion

/*
 |--------------------------------------------------------------------------------
 | Access Token
 |--------------------------------------------------------------------------------
 */

//#region

export abstract class Token<D extends TokenData = TokenData> {
  public readonly value: string;

  protected data?: D;

  constructor(value: string) {
    this.value = value;
  }

  /**
   * Get a value from the token data assigned to the provided key.
   *
   * @param fallback - Return provided fallback value if data has not
   *                   been resolved or throw an error.
   */
  public get<T extends keyof D>(key: T, fallback?: D[T]) {
    if (!this.data) {
      if (fallback) {
        return fallback;
      }
      throw new DataAccessError();
    }
    return this.data[key];
  }

  /**
   * Decode the token value and populate the token data.
   *
   * @example
   *
   * ```ts
   * this.data = jwt.decode(this.value);
   * ```
   */
  public abstract decode(): Promise<this>;

  /**
   * Verify and return the authenticity of the token.
   *
   * On the server side the token verification should be run through
   * a server side 'secret'. On the client verification can simply
   * be determined by the existence of resolved data object.
   *
   * **Examples**
   *
   * _Server_
   *
   * ```ts
   * return jwt.verify(this.value, secret);
   * ```
   *
   * _Client_
   *
   * ```ts
   * return this.data !== undefined;
   * ```
   */
  public abstract verify(): Promise<boolean>;
}

//#endregion

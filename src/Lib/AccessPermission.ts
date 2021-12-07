import { AccessResponse } from "../Types/Handlers";
import { AccessAttributes } from "./AccessAttributes";

export const PERMISSION_DENIED_MESSAGE = "Permission denied";

export class AccessPermission<Attributes extends AccessAttributes = AccessAttributes> {
  public readonly granted: boolean;
  public readonly message: string = PERMISSION_DENIED_MESSAGE;

  public readonly attributes?: Attributes;

  constructor(response: AccessResponse<Attributes>) {
    this.granted = response.granted === true;
    if (response.granted === true && response.attributes) {
      this.attributes = response.attributes;
    }
    if (response.granted === false && response.message) {
      this.message = response.message;
    }
  }

  public filter<T extends Record<string, unknown>>(data: T | T[], filter = "$all") {
    if (!this.attributes) {
      return data;
    }
    if (Array.isArray(data)) {
      return data.map((data) => this.attributes!.filter(filter, data));
    }
    return this.attributes.filter(filter, data);
  }
}

import { container } from "../../src/Container";
import { Store } from "../../src/Services/Store";
import { GrantOperation, GrantsData } from "../../src/Types/Grants";

export const store: { [id: string]: GrantsData } = {};

class TestAccessStore implements Store {
  public async setGrants(id: string, acid: string, operations: GrantOperation[]): Promise<void> {
    const grants = await this.getGrants(id);

    for (const operation of operations) {
      switch (operation.type) {
        case "set": {
          assign(grants, acid, operation.resource, operation.action, operation.data);
          break;
        }
        case "unset": {
          remove(grants, acid, operation.resource, operation.action);
          break;
        }
      }
    }

    store[id] = grants;
  }

  public async getGrants(id: string): Promise<GrantsData> {
    if (store[id]) {
      return JSON.parse(JSON.stringify(store[id]));
    }
    return {};
  }
}

function assign(grants: GrantsData, acid: string, resource: string, action: string, data: any): void {
  if (!grants[acid]) {
    grants[acid] = {};
  }
  if (!grants[acid][resource]) {
    grants[acid][resource] = {};
  }
  grants[acid][resource][action] = data;
}

function remove(grants: GrantsData, acid: string, resource: string, action?: string): void {
  if (action) {
    delete grants[acid][resource][action];
  } else {
    delete grants[acid][resource];
  }
}

container.set("Store", new TestAccessStore());

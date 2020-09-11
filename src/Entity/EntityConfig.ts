import {Base} from "./Base";
import {FieldConfig} from "./FieldConfig";

export class EntityConfig {
  constructor(public proto: Object) {}

  private fields: Map<string | Symbol, FieldConfig> = new Map();

  eachField(visit: (f: FieldConfig) => void): void {
    for (const f of this.fields.values()) {
      visit(f);
    }
  }

  addField(field: FieldConfig): void {
    this.fields.set(field.name, field);
  }

  static forInstance(entity: Base): EntityConfig {
    return this.forPrototype(Object.getPrototypeOf(entity));
  }

  static forConstructor(constructor: Function): EntityConfig {
    return this.forPrototype(constructor.prototype);
  }

  static forPrototype(proto: Object): EntityConfig {
    const p = proto as Proto;
    const config = p[ENTITY_CONFIGURATION_KEY] ?? new EntityConfig(p);

    p[ENTITY_CONFIGURATION_KEY] = config;
    return config;
  }
}

export const ENTITY_CONFIGURATION_KEY = Symbol("ENTITY_CONFIGURATION");
interface Proto {
  [ENTITY_CONFIGURATION_KEY]?: EntityConfig;
}

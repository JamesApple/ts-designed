import {FieldConfig} from "./FieldConfig";

export class EntityConfig {
  constructor(public proto: Object) {}

  private fields: Map<string | Symbol, FieldConfig> = new Map();

  addField(field: FieldConfig) {
    this.fields.set(field.name, field);
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

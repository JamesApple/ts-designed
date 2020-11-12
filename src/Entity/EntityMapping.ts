import {Base} from "./Base";
import {EntityConfig} from "./EntityConfig";
import {FieldConfig} from "./FieldConfig";
import {CreateArgs, isMappedCreateArgs, Mapping} from "./utilityTypes";

export class EntityMapping {
  private data: Object;
  private mappingConfig: {
    [key: string]: Mapping<Base, Object, any> | undefined;
  };

  constructor(
    public instance: Base,
    args: CreateArgs<Base, Object> = {data: {}}
  ) {
    this.data = args.data ?? {};
    this.mappingConfig = isMappedCreateArgs(args) ? args.mapping : {};
  }

  map(): void {
    this.entityConfig.eachField((f) => {
      const mapping = this.mappingConfig[f.name];
      if (mapping) {
        if (typeof mapping === "string") {
          this.assign(f, getValue(mapping, this.data));
        } else {
          this.assign(
            f,
            mapping((this.data as any)[f.name], {
              instance: this.instance,
              data: this.data
            })
          );
        }
      } else {
        this.assign(f, getValue(f.name, this.data));
      }
    });
  }

  private assign(field: FieldConfig, data: Object): void {
    (this.instance as any)[field.name] = data;
  }

  get entityConfig(): EntityConfig {
    return EntityConfig.forInstance(this.instance);
  }
}

export function getValue(path: string, object: unknown): any {
  return path
    .replace(/\[/g, ".")
    .replace(/\]/g, "")
    .split(".")
    .reduce((o: any, k: string) => (o || {})[k], object);
}

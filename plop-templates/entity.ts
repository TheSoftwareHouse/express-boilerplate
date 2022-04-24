import { Column, Entity, PrimaryColumn } from "typeorm";

interface {{pascalCase name}}EntityProps {
  id: string;
}

@Entity({
  name: "{{snakeCase name}}",
})
export class {{pascalCase name}}Entity {
  public static create(data: Partial<{{pascalCase name}}EntityProps>): {{pascalCase name}}Entity {
    const entity = new {{pascalCase name}}Entity();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryColumn()
  id: string;
}

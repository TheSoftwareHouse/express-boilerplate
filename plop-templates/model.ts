import { Column, Entity, PrimaryColumn } from "typeorm";

interface {{pascalCase name}}ModelProps {
  id: string;
}

@Entity({
  name: "{{snakeCase name}}"
})
export class {{pascalCase name}}Model {

  public static create(data: Partial<{{pascalCase name}}ModelProps>): {{pascalCase name}}Model {
    const entity = new {{pascalCase name}}Model();
    Object.assign(entity, data);
    return entity
  }

  @PrimaryColumn()
  id: string;
}

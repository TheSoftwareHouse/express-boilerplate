import { Column, Entity, PrimaryColumn } from 'typeorm';

interface {{capitalize name.camelCased}}ModelProps {
  id: string;
}

@Entity({
  name: "{{capitalize name.camelCased}}"
})
export class {{capitalize name.camelCased}}Model {

  public static create(data: Partial<{{capitalize name.camelCased}}ModelProps>): {{capitalize name.camelCased}}Model {
    const entity = new {{capitalize name.camelCased}}Model();
    Object.assign(entity, data);
    return entity
  }

  @PrimaryColumn()
  id: string;
}

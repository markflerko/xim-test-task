import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class File {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;
}

export default File;
import {Column, Entity} from "typeorm";

@Entity()
export class TestEntity {
    id: number;
    @Column()
    name: string;
}
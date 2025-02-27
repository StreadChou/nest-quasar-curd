import {PrimaryGeneratedColumn, Column, Entity} from "typeorm";

/** 用户表 */
@Entity({name: "__System__Task"})
export class User {


    /** 自增ID */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /** 名字 */
    @Column({comment: "名字", nullable: false, unique: false, length: 30,})
    name: string;


}
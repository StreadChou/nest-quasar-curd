import {Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn} from "typeorm";

/** 文章表 */
@Entity({name: "__System__Task"})
export class Post {


    /** 自增ID */
    @PrimaryGeneratedColumn()
    id?: number;

    /** 更新时间 */
    @UpdateDateColumn()
    updated_at?: Date;

    /** 创建时间 */
    @CreateDateColumn()
    created_at?: Date;


}
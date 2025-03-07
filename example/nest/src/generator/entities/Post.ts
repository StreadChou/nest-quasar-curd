import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Entity} from 'typeorm'



/** 文章表 */
@Entity({name: "Post"})
export class Post {


    /** 自增ID */
    @PrimaryGeneratedColumn()
    id?: number;
    /** 创建时间 */
    @CreateDateColumn()
    created_at?: Date;
    /** 更新时间 */
    @UpdateDateColumn()
    updated_at?: Date;
    /** 作者 */
    @Column({comment: "作者", nullable: false, unique: false,})
    auth: number;


}
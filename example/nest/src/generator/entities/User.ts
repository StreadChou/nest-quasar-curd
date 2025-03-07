import {PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn, Entity} from 'typeorm'
import {UserConfig} from '../constants/UserConstants'
import {Post} from './Post'



/** 用户表 */
@Entity({name: "User"})
export class User {


    /** 自增ID */
    @PrimaryGeneratedColumn()
    id?: number;
    /** 用户名 */
    @Column({comment: "用户名", nullable: true, unique: false,})
    name?: string;
    /** 年龄 */
    @Column({comment: "年龄", nullable: false, unique: false, default: 0,})
    age: number;
    /** 活跃 */
    @Column({comment: "活跃", nullable: true, unique: false,})
    active?: boolean;
    /** 生日 */
    @Column({comment: "生日", nullable: true, unique: false, type: "date",})
    birth?: Date;
    /** 配置 */
    @CreateDateColumn()
    config: UserConfig;
    /** 文章列表 */
    @OneToMany(() => Post, (target) => target.auth)
    posts: Array<Post>;
    /** 创建时间 */
    @CreateDateColumn()
    created_at?: Date;
    /** 更新时间 */
    @UpdateDateColumn()
    updated_at?: Date;


}
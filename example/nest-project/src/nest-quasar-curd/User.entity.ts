import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

/** 用户库 */
@Entity({name : "User"})
export class UserCurdEntity {

	/** # */
	@PrimaryGeneratedColumn()
	id: number;

	/** 用户名 */
	@Column({comment: "用户名"})
	username: string;

	/** 密码 */
	@Column({comment: "密码"})
	password: string;

	/** 创建时间 */
	@CreateDateColumn({comment: "创建时间"})
	created_at: Date;

	/** 更新时间 */
	@UpdateDateColumn({comment: "更新时间"})
	updated_at: Date;


}
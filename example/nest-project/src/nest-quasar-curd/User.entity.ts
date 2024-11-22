import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

/** 用户库 */
@Entity({name : "User"})
export class UserCurdEntity {

	/** # */
	@PrimaryGeneratedColumn()
	id: number;

	/** 创建时间 */
	@CreateDateColumn({comment: "创建时间"})
	created_at: Date;

	/** 更新时间 */
	@UpdateDateColumn({comment: "更新时间"})
	updated_at: Date;


}
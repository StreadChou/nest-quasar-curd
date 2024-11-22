import type {AxiosInstance} from "axios";
import {AbstractViewData, type ColumnsDefine, type ViewDataOption} from "@stread/quasar-curd";
import {UserInterface} from "./User.interface";

export class UserViewData extends AbstractViewData<UserInterface> {
    /** restful api 的前缀 */
    restful: string = "User/Curd";
    /** 字段定义 */
    columns: Record<string, ColumnsDefine> = {"id":{"label":"#","type":"number","backend":{"decorator":["@PrimaryGeneratedColumn()"]},"frontend":{"show_at_home":true,"hidden_at_create":true,"disable_at_update":true}},"username":{"label":"用户名","type":"string","backend":{"decorator":["@Column({comment: \"__COLUMNS_LABEL__\"})"]},"frontend":{"show_at_home":true}},"password":{"label":"密码","type":"string","backend":{"decorator":["@Column({comment: \"__COLUMNS_LABEL__\"})"]},"frontend":{"show_at_home":false}},"created_at":{"label":"创建时间","type":"Date","backend":{"decorator":["@CreateDateColumn({comment: \"__COLUMNS_LABEL__\"})"]},"frontend":{"show_at_home":true,"hidden_at_create":true,"disable_at_update":true}},"updated_at":{"label":"更新时间","type":"Date","backend":{"decorator":["@UpdateDateColumn({comment: \"__COLUMNS_LABEL__\"})"]},"frontend":{"show_at_home":true,"hidden_at_create":true,"disable_at_update":true}}};

    constructor(api: AxiosInstance, option?: ViewDataOption) {
        super(api, option);
        this.initColumnsTypeHandler();
    }
}

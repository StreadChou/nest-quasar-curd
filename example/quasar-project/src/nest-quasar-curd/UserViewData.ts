import type {AxiosInstance} from "axios";
import {AbstractViewData, type EntityDefine, type ColumnsDefine, type ViewDataOption} from "@stread/quasar-curd";
import {UserInterface} from "./User.interface";

export class UserViewData extends AbstractViewData<UserInterface> {
    /** restful api 的前缀 */
    restful: string = "User/Curd";
    /** 配置表 */
    define: EntityDefine = {"TableMark":"用户库","ClassName":"User","Restful":"User","columns":{"id":{"label":"#","type":"number","backend":{"decorator":["@PrimaryGeneratedColumn()"]},"frontend":{"show_at_home":true,"hidden_at_create":true,"disable_at_update":true}},"username":{"label":"用户名","type":"string","backend":{"decorator":["@Column({comment: \"__COLUMNS_LABEL__\"})"]},"frontend":{"show_at_home":true}},"password":{"label":"密码","type":"string","backend":{"decorator":["@Column({comment: \"__COLUMNS_LABEL__\"})"]},"frontend":{"show_at_home":false}},"leader":{"label":"直系领导","type":"relation","type_extension":{"type_string":"UserCurdEntity"},"backend":{"decorator":["@ManyToOne(()=> UserCurdEntity, {eager: true})"]},"frontend":{"show_at_home":true,"editor_bind":{"option-label":"username","map-options":true,"standout":true,"clearable":true}}},"created_at":{"label":"创建时间","type":"Date","backend":{"decorator":["@CreateDateColumn({comment: \"__COLUMNS_LABEL__\"})"]},"frontend":{"show_at_home":true,"hidden_at_create":true,"disable_at_update":true}},"updated_at":{"label":"更新时间","type":"Date","backend":{"decorator":["@UpdateDateColumn({comment: \"__COLUMNS_LABEL__\"})"]},"frontend":{"show_at_home":true,"hidden_at_create":true,"disable_at_update":true}}},"backend":{"EntityDecorator":["@Entity({name : \"User\"})"]},"frontend":{"home_page":"/User/Home","form_page":"/User/Form/:id"}};

    constructor(api: AxiosInstance, option?: ViewDataOption) {
        super(api, option);
        this.initColumnsTypeHandler();
    }
}

import {AbstractViewData, type ColumnsDefine, type ViewDataOption} from "@stread/quasar-curd";
import {UserInterface} from "./User.interface";

export class UserViewData extends AbstractViewData<UserInterface> {
    static after_create: Function | undefined = undefined;
    static after_update: Function | undefined = undefined;
    static after_delete: Function | undefined = undefined;

    /** restful api 的前缀 */
    restful: string = "User/Curd";
    /** 字段定义 */
    columns: ColumnsDefine = __COLUMNS_DEFINE__;
    /** 列表页需要展示的字段列表 */
    home_show_columns: string[] = __HOME_SHOW_COLUMNS__;
    /** 创建需要展示的字段列表 */
    create_show_columns: string[] = __CREATE_SHOW_COLUMNS__;
    /** 更新的时候需要展示的字段列表 */
    update_show_columns: string[] = __UPDATE_SHOW_COLUMNS__;
    /** 表单页面的布局 */
    form_grids: Array<string | Array<string>> = __COLUMNS_GRIDS__

    constructor(api, option?: ViewDataOption) {
        super(api, option);
        this.initColumnsTypeHandler();
    }
}

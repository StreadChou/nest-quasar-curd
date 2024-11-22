/** 数据类的附加参数 */
export interface ViewDataOption {

    before_save?: () => void;
    after_save?: () => void;

    before_delete?: () => void;
    after_delete?: () => void;
}
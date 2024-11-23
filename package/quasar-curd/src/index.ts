import DefaultHomePage from "./view/DefaultHomePage.vue"
import DefaultFormPage from "./view/DefaultFormPage.vue"
import DefaultRemoveDialog from "./view/DefaultRemoveDialog.vue"
import DefaultFormSelector from "./view/DefaultFormSelector.vue"


export const name = "quasar-curd";
export * from "./data/index";
export * from "./link/index";
export * from "./define/HomePageDefine";
export * from "./define/FormPageDefine";
export * from "./define/constant";


export const DefaultHomePageVue = DefaultHomePage;
export const DefaultFormPageVue = DefaultFormPage;
export const DefaultRemoveDialogVue = DefaultRemoveDialog;
export const DefaultFormSelectorVue = DefaultFormSelector;
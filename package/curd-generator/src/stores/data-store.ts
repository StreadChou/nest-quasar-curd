import {defineStore, acceptHMRUpdate} from 'pinia';
import {InvokeProxy} from "src/library/InvokeProxy";
import {JsonFile, ModelsItem, ModulesItem} from "app/type/JsonFileDefine/Index";
import {QTreeNode} from "quasar/dist/types/api";
import {useRouter} from "vue-router";
import {Project} from "stores/DataStore/Project";
import {useHistoryStore} from "stores/history-store";
import {ProjectHistoryItem} from "app/type/Project";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";


export const useDataStore = defineStore('data', {
  state: () => ({
    /** 左侧 菜单栏 是否展开 */
    leftDrawerOpen: false,
    /** 左侧的树状图 */
    treeNodes: [
      {
        label: '项目 - A',
        selectable: false,
        children: [
          {
            label: '模型列表',
            selectable: false,
            children: [
              {
                label: '路径设置',
                icon: 'folder',
                handler: async (data) => {
                  const router = useRouter();
                  await router.push("/setting")
                }
              },
            ]
          },
          {
            label: '系统设置',
            selectable: false,
            children: [
              {
                label: '路径设置',
                icon: 'folder',
                handler: async (data) => {
                  const router = useRouter();
                  await router.push("/setting")
                }
              },
            ]
          }
        ]
      },

    ] as QTreeNode[],
    /** 左侧选择 */
    treeSelected: "",

    /** 所有项目 */
    ProjectList: [] as Project[],

    counter: 0,
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    /** 打开一个项目 */
    async openProject(file_path: string) {
      const reply = await InvokeProxy("FileHandler.loadJsonFile", file_path)
      if (reply.code != 0) return InvokeErrorHandler(reply);
      const data: JsonFile = reply.data;


      const item: ProjectHistoryItem = {
        project: data.name,
        file_path: file_path,
        modules_number: 1,
        models_number: 1,
        created_at: data.created_at,
        updated_at: data.created_at,
      }
      const historyStore = useHistoryStore();
      await historyStore.pushOrUpdate(item);

      console.log(data)
    },
    // async loadData() {
    //   const data = await InvokeProxy("FileHandler.loadJsonFile")
    //   this.initData(data)
    // },
    // async startExport() {
    //   const info = JSON.stringify({
    //     json_file_path: this.json_file_path,
    //     backend_path: this.backend_path,
    //     frontend_path: this.frontend_path,
    //   })
    //   const data = await InvokeProxy("FileHandler.startExport", info)
    // },
    // async saveData() {
    //   const data_string = JSON.stringify(this.data, null, 2)
    //   const data = await InvokeProxy("FileHandler.saveJsonFile", this.json_file_path, data_string)
    //   console.log(data);
    // },
    // initData(data: JsonFile) {
    //   this.data = undefined;
    //   this.breadcrumbs = []
    //   data.modules = data.modules || {};
    //   this.data = data;
    // },
    //
    // getModule(module_name: string): ModulesItem {
    //   this.data.modules = this.data.modules || {};
    //   if (module_name in this.data.modules) return this.data.modules[module_name] as ModulesItem;
    //   return {} as ModulesItem;
    // },
    //
    // getModel(module_name: string, model_name: string) {
    //   const module = this.getModule(module_name)
    //   if (!module.models) return {} as ModelsItem;
    //   if (model_name in module.models) return module.models[model_name] as ModelsItem;
    //   return {} as ModelsItem;
    // },
    //
    // setModule(module: ModulesItem) {
    //   this.data.modules = this.data.modules || {};
    //   this.data.modules[module.name as string] = module;
    // },
    //
    // setModel(module_name: string, model: ModelsItem) {
    //   const module = this.getModule(module_name)
    //   module.models = module.models || {};
    //   module.models[model.name as string] = model;
    // },
    //
    // increment() {
    //   this.counter++;
    // },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}

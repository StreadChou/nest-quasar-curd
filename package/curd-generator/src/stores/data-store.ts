import {defineStore, acceptHMRUpdate} from 'pinia';
import {InvokeProxy} from "src/library/InvokeProxy";
import {JsonFile, ModelsItem, ModulesItem} from "app/type/JsonFileDefine/Index";

export const useDataStore = defineStore('data', {
  state: () => ({
    json_file_path: "/Volumes/Project/003_Stread/nest-quasar-curd/package/data/test.json",
    backend_path: "/Volumes/Project/003_Stread/nest-quasar-curd/example/nest/src/curd",
    frontend_path: "/Volumes/Project/003_Stread/nest-quasar-curd/example/quasar/src/curd",
    data: {} as JsonFile,
    counter: 0,
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async loadData() {
      const data = await InvokeProxy("FileHandler.loadJsonFile")
      this.initData(data)
    },
    async startExport() {
      const info = JSON.stringify({
        json_file_path: this.json_file_path,
        backend_path: this.backend_path,
        frontend_path: this.frontend_path,
      })
      const data = await InvokeProxy("FileHandler.startExport", info)
    },
    async saveData() {
      const data_string = JSON.stringify(this.data, null, 2)
      const data = await InvokeProxy("FileHandler.saveJsonFile", this.json_file_path, data_string)
      console.log(data);
    },
    initData(data: JsonFile) {
      data.modules = data.modules || {};
      this.data = data;
    },

    getModule(module_name: string): ModulesItem {
      this.data.modules = this.data.modules || {};
      if (module_name in this.data.modules) return this.data.modules[module_name] as ModulesItem;
      return {} as ModulesItem;
    },

    getModel(module_name: string, model_name: string) {
      const module = this.getModule(module_name)
      if (!module.models) return {} as ModelsItem;
      if (model_name in module.models) return module.models[model_name] as ModelsItem;
      return {} as ModelsItem;
    },

    setModule(module: ModulesItem) {
      this.data.modules = this.data.modules || {};
      this.data.modules[module.name as string] = module;
    },

    setModel(module_name: string, model: ModelsItem) {
      const module = this.getModule(module_name)
      module.models = module.models || {};
      module.models[model.name as string] = model;
    },

    increment() {
      this.counter++;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}

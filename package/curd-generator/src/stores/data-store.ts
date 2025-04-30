import {defineStore, acceptHMRUpdate} from 'pinia';
import {InvokeProxy} from "src/library/InvokeProxy";
import {JsonFile, ModelsItem, ModulesItem} from "app/type/JsonFileDefine/Index";

export const useDataStore = defineStore('data', {
  state: () => ({
    json_file_path: "",
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
      if (model_name in module.models) return module.models[model_name] as ModelsItem;
      return {} as ModelsItem;
    },

    setModule(module: ModulesItem) {
      this.data.modules = this.data.modules || {};
      this.data.modules[module.name] = module;
    },

    setModel(module_name: string, model: ModelsItem) {
      const module = this.getModule(module_name)
      module.models = module.models || {};
      module.models[model.name] = model;
    },

    increment() {
      this.counter++;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}

import {defineStore, acceptHMRUpdate} from 'pinia';
import {InvokeProxy} from "src/library/InvokeProxy";
import {JsonFile} from "app/type/JsonFileDefine/Index";

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
    initData(data: JsonFile) {
      data.modules = data.modules || {};
      this.data = data;
    },
    increment() {
      this.counter++;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}

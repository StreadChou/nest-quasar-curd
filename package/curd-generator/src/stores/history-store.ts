import {defineStore, acceptHMRUpdate} from 'pinia';
import {LocalStorage} from 'quasar'
import {ProjectHistoryItem} from "app/type/Project";

export const useHistoryStore = defineStore('history', {
  state: () => ({
    loaded: false,
    historyData: [] as ProjectHistoryItem[],
  }),

  getters: {
    key: () => {
      return "nest-curd-history"
    },
  },
  actions: {
    async loadFromStorage() {
      const key = this.key;
      const data = LocalStorage.getItem<ProjectHistoryItem[]>(key);
      if (!data) return null;
      this.historyData = data;
      this.loaded = true;
    },
    async pushOrUpdate(item: ProjectHistoryItem) {
      if (!this.loaded) await this.loadFromStorage();
      const exist = this.historyData.find(ele => ele.file_path == item.file_path);
      if (!exist) this.historyData.push(item);
      else Object.assign(exist, item)

      const key = this.key;
      LocalStorage.set(key, this.historyData);
    },
    async removeItem(item: ProjectHistoryItem) {
      if (!this.loaded) await this.loadFromStorage();
      const index = this.historyData.findIndex(ele => ele.file_path == item.file_path);
      if (index >= 0) this.historyData.splice(index, 1);

      const key = this.key;
      LocalStorage.set(key, this.historyData);
    },
    async clearAll() {
      this.historyData = [];
      const key = this.key;
      LocalStorage.set(key, this.historyData);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHistoryStore, import.meta.hot));
}

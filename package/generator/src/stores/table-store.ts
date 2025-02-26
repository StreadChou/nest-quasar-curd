import {defineStore, acceptHMRUpdate} from 'pinia';
import {Table} from "app/src-ssr/types/Table";

export const useTableStore = defineStore('table', {
  state: () => ({
    tableList: [] as Array<Table>,
    nowEditTable: {} as Partial<Table>,
    nowEditTableForm: {} as Partial<Table>,
  }),

  getters: {},

  actions: {
    changeEditTable(table: Partial<Table>) {
      this.nowEditTable = table;
      this.nowEditTableForm = JSON.parse(JSON.stringify(table));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTableStore, import.meta.hot));
}

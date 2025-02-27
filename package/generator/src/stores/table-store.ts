import {defineStore, acceptHMRUpdate} from 'pinia';
import {Table} from "app/src-ssr/types/Table";
import {api} from "boot/axios";

export const useTableStore = defineStore('table', {
  state: () => ({
    moduleList: [] as Array<any>,
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


    loadServerData(body: { modules: any, tables: any }) {
      this.tableList = body.tables;
    },

    async getServerData() {
      const AxiosResponse = await api.post("_GET_JSON_FILE",)
      if (AxiosResponse.data.code != 0) {
        return null;
      }
      const {content} = AxiosResponse.data.data;
      this.loadServerData(content)
    },

    async saveTableView() {
      const AxiosResponse = await api.post("_UPDATE_JSON_FILE", {
        content: {
          modules: this.moduleList,
          tables: this.tableList,
        }
      })
      if (AxiosResponse.data.code == 0) return null;
    },

    async exportTableView() {
      const AxiosResponse = await api.post("_ExportTable", {
        content: {
          modules: this.moduleList,
          tables: this.tableList,
        }
      })
      if (AxiosResponse.data.code == 0) return null;
    }


  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTableStore, import.meta.hot));
}

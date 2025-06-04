import {defineStore, acceptHMRUpdate} from 'pinia';
import HomePage from "components/HomePage.vue";

export interface ViewItem {
  name?: string;
  icon?: string;
  id: string;
  view: any;
  props: any;
}

export const useViewStore = defineStore('view', {
  state: () => ({
    active: "",
    viewList: [] as ViewItem[],
  }),

  actions: {
    openOrChangePanel(item: ViewItem) {
      const old = this.viewList.find(ele => item.id == ele.id);
      if (old) {
        this.active = old.id;
        return null;
      }

      this.viewList.push(item);
      this.active = item.id;
    },
    openHomePanel() {
      this.openOrChangePanel({
        icon: "home",
        id: "HomePage",
        view: HomePage,
        props: {}
      })
    },

    closePanel(id: string) {
      this.viewList = this.viewList.filter(ele => ele.id != id);
      if (this.active == id) {
        if (this.viewList.length > 0) {
          this.active = (this.viewList[this.viewList.length - 1] as ViewItem).id;
        } else {
          this.active = "";
        }
      }
    },

  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useViewStore, import.meta.hot));
}

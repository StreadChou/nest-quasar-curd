<template>
  <q-page class="full-width full-height row q-gutter-x-md q-py-md">
    <div class="column bg-white" style="min-width: 200px">
      <q-scroll-area class="col">
        <TableList></TableList>
      </q-scroll-area>
      <div>
        <q-btn class="full-width" color="primary" label="增加表" @click="openAddTableDialog"></q-btn>
      </div>
    </div>
    <div class="col" v-if="Object.keys(tableStore.nowEditTable).length > 0">
      <TableView></TableView>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TableList from "components/Table/TableList.vue";
import {useTableStore} from "stores/table-store";
import AddTableDialog from "components/Table/AddTableDialog.vue";
import {useQuasar} from "quasar";
import TableView from "components/Table/TableView.vue";


const $q = useQuasar();
const tableStore = useTableStore();


const openAddTableDialog = () => {
  $q.dialog({
    component: AddTableDialog,
  })
}

</script>

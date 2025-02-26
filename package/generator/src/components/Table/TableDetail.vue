<script setup lang="ts">
import {useQuasar} from "quasar";
import {useTableStore} from "stores/table-store";
import {ref} from "vue";
import {Table} from "app/src-ssr/types/Table";

const $q = useQuasar();
const tableStore = useTableStore();

const form = ref<Partial<Table>>()


</script>

<template>
  <q-card>
    <q-card-section class="row q-col-gutter-x-md">
      <div class="col">
        <q-input v-model="tableStore.nowEditTableForm.Name" label="名称" standout dense/>
      </div>
      <div class="col">
        <q-input v-model="tableStore.nowEditTableForm.ClassName" label="类名" standout dense/>
      </div>
      <div class="col">
        <q-input v-model="tableStore.nowEditTableForm.Restful" label="Restful接口" standout dense/>
      </div>
    </q-card-section>
    <q-card-section align="right">
      <q-btn flat dense label="移除" color="negative"/>
      <q-btn flat dense label="关闭" color="dark"/>
      <q-btn flat dense label="还原" color="secondary"/>
      <q-btn flat dense label="保存" color="primary"/>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>

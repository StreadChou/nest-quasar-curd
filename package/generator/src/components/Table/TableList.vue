<script setup lang="ts">
import {useTableStore} from "stores/table-store";

const tableStore = useTableStore();


</script>

<template>
  <q-list>
    <template v-for="item of tableStore.tableList">
      <q-item clickable v-ripple @click="tableStore.changeEditTable(item)">
        <q-item-section>
          <q-item-label>{{ item.Name }} - {{ item.ClassName }}</q-item-label>
          <q-item-label caption> {{ item == tableStore.nowEditTable ? "选中" : "" }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator/>
    </template>
  </q-list>
</template>

<style scoped>

</style>

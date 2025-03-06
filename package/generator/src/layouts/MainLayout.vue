<template>
  <q-layout class="bg-grey-1">
    <q-header elevated class="text-white" style="background: #24292e" height-hint="61.59">
      <q-toolbar class="q-py-sm q-px-md">


        <div class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn label="实体 - Entities" no-caps flat dense to="/Entities"/>
          <q-btn label="模块 - Modules" no-caps flat dense to="/Modules"/>
          <q-btn label="模板 - Templates" no-caps flat dense to="/Templates"/>
        </div>

        <q-space/>

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn label="保存" flat dense @click="tableStore.saveDataToServer()"/>
          <q-btn label="导出" flat dense @click="tableStore.exportTableView()"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-3">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {useTableStore} from "stores/table-store";
import {onMounted} from "vue";

const tableStore = useTableStore();


onMounted(() => {
  tableStore.getServerData()
})

</script>

<style lang="sass">

</style>

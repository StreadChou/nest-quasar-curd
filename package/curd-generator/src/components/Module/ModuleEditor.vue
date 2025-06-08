<script setup lang="ts">
import {useViewStore} from "stores/view-store";
import {ref} from "vue";
import {ProjectRecord, useDataStore} from "stores/data-store";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import CreateModel from "components/Model/CreateModel.vue";

const props = defineProps<{
  count: number,
  viewId: string,
  module: ModuleConfig
}>()
const dataStore = useDataStore();

const viewStore = useViewStore();
const projectRecord = ref<ProjectRecord>(dataStore.getProjectRecord(props.count));
const moduleConfig = ref<ModuleConfig>(projectRecord.value.json_data.modules[props.module.name] as ModuleConfig);

const form = ref<Partial<ModuleConfig>>({
  name: moduleConfig.value.name,
  isExport: moduleConfig.value.isExport,
  toList: moduleConfig.value.toList,
  isGlobal: moduleConfig.value.isGlobal,
})

const save = () => {
  dataStore.updateModule(props.count, form.value)
}

</script>

<template>
  <div>
    <div class="row class bg-grey q-pa-sm">
      <q-space></q-space>
      <div class="q-gutter-x-sm">
        <q-btn color="primary" dense size="sm" icon="save" @click="save"></q-btn>
        <CreateModel :count="count" :module="module"></CreateModel>
        <q-btn color="negative" dense size="sm" icon="close" @click="viewStore.closePanel(viewId)"></q-btn>
      </div>
    </div>
    <div class="q-gutter-y-md">
      <div>
        <q-input standout dense v-model="form.name" label="名称" :disable="true"></q-input>
    </div>

      <div class="bg-grey-2 q-py-sm">
        <q-checkbox v-model="form.isExport" label="是否导出"></q-checkbox>
        <q-checkbox v-model="form.toList" label="是否加入到 ModuleList "></q-checkbox>
        <q-checkbox v-model="form.isGlobal" label="是否全局 "></q-checkbox>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>

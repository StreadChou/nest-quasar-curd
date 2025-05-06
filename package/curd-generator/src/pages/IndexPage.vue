<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-input standout dense :model-value="dataStore.json_file_path" label="JSON文件位置">
        <template v-slot:after>
          <q-btn color="primary" @click="openJsonFileSelectDialog()" label="选择"></q-btn>
        </template>
      </q-input>

      <div class="q-gutter-y-xs">
        <q-input standout dense :model-value="dataStore.backend_path" label="后端文件夹位置">
        </q-input>
        <q-input standout dense :model-value="dataStore.frontend_path" label="前端文件夹位置">
        </q-input>
        <q-btn class="full-width" color="primary" @click="startExport()" label="导出"></q-btn>
      </div>


    </div>
    <q-separator class="q-my-md"></q-separator>
    <div v-if="dataStore.json_file_path">
      <ModulesList></ModulesList>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ModulesList from "components/modules/ModulesList.vue";
import {useDataStore} from "stores/data-store";
import {InvokeProxy} from "src/library/InvokeProxy";


const dataStore = useDataStore()


const openJsonFileSelectDialog = async () => {
  dataStore.json_file_path = await InvokeProxy("FileHandler.openFileDialog")
  await dataStore.loadData();
}

const startExport = async () => {
  await dataStore.startExport();
}

</script>

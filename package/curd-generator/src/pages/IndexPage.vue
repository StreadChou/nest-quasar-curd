<template>
  <q-page class="q-pa-md">
    <div>
      <q-input standout dense :model-value="dataStore.json_file_path" label="JSON文件位置">
        <template v-slot:after>
          <q-btn color="primary" @click="openJsonFileSelectDialog()" label="选择"></q-btn>
        </template>
      </q-input>
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

</script>

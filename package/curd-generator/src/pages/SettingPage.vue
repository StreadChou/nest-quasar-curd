<script setup lang="ts">

import {useDataStore} from "stores/data-store";
import {InvokeProxy} from "src/library/InvokeProxy";

const dataStore = useDataStore()

const openJsonFileSelectDialog = async () => {
  dataStore.json_file_path = await InvokeProxy("FileHandler.openFileDialog")
  await dataStore.loadData();
}
</script>

<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-subtitle1">配置路径</div>
        <q-input standout dense :model-value="dataStore.json_file_path" label="JSON文件位置">
          <template v-slot:after>
            <q-btn color="primary" @click="openJsonFileSelectDialog()" label="选择"></q-btn>
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>

</style>

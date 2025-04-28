<script setup lang="ts">

import ModuleListItem from "components/modules/ModuleListItem.vue";
import {useDataStore} from "stores/data-store";


const dataStore = useDataStore();

</script>

<template>
  <div class="row q-col-gutter-sm">
    <div class="col-3">
      <q-btn class="full-height full-width" icon="add" label="增加module" color="primary"
             to="/module/form/0"
      ></q-btn>
    </div>

    <template v-if="dataStore.data.modules">
      <template v-for="(item, key) in dataStore.data.modules" :key="key">
        <div class="col-3">
          <ModuleListItem :module="item.name"></ModuleListItem>
        </div>
      </template>
    </template>


  </div>
</template>

<style scoped>

</style>

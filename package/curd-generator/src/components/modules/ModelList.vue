<script setup lang="ts">
import ModelListItem from "components/modules/ModelListItem.vue";
import {useDataStore} from "stores/data-store";
import {ref} from "vue";
import {ModulesItem} from "app/type/JsonFileDefine/Index";

const props = defineProps<{
  module: string;
}>()

const dataStore = useDataStore();
const moduleData = ref<ModulesItem>(JSON.parse(JSON.stringify(dataStore.data.modules[props.module])));


</script>

<template>
  <div class="row q-col-gutter-sm">
    <div class="col-3">
      <q-btn class="full-height full-width" icon="add" label="增加Model" color="primary"
             :to="`/model/form/${module}/0`"
      ></q-btn>
    </div>

    <template v-if="moduleData.models">
      <template v-for="(item, key) in moduleData.models" :key="key">
        <div class="col-3">
          <ModelListItem :module="module" :model="item.name"></ModelListItem>
        </div>
      </template>
    </template>


  </div>
</template>

<style scoped>

</style>

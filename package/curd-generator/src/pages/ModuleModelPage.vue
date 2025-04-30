<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useDataStore} from "stores/data-store";
import {ModulesItem} from "app/type/JsonFileDefine/Index";
import ModelList from "components/modules/ModelList.vue";

const route = useRoute();

const dataStore = useDataStore();
const module = ref<string>(route.params.module as string);
const moduleData = ref<ModulesItem>(JSON.parse(JSON.stringify(dataStore.data.modules[module.value])));

</script>

<template>
  <q-page>
    <q-banner dense inline-actions class="text-white bg-teal">
      您正在 编辑/新增 modules -> model
      <template v-slot:action>
        <q-btn flat color="white" label="返回到Modules列表" to="/"/>
        <q-btn flat color="white" label="预览"/>
      </template>
    </q-banner>
    <div>
      <ModelList :module="module"></ModelList>
    </div>
  </q-page>
</template>

<style scoped>

</style>

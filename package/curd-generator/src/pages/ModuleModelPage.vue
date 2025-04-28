<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useDataStore} from "stores/data-store";
import {ModulesItem} from "app/type/JsonFileDefine/Index";
import ModelList from "components/modules/ModelList.vue";

const route = useRoute();

const dataStore = useDataStore();


const form = ref<ModulesItem>({})

onMounted(() => {
  const module = route.params.module;
  const data = dataStore.data.modules[module];
  form.value = JSON.parse(JSON.stringify(data));
})
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
      <ModelList></ModelList>
    </div>
  </q-page>
</template>

<style scoped>

</style>

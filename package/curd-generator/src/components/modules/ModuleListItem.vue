<script setup lang="ts">
import {useDataStore} from "stores/data-store";
import {computed, ref} from "vue";
import {ModulesItem} from "app/type/JsonFileDefine/Index";

const props = defineProps<{
  module: string;
}>()

const dataStore = useDataStore();
const data = ref<ModulesItem>(dataStore.data.modules[props.module]);


</script>

<template>
  <q-card v-if="data">
    <q-card-section>
      <div class="text-h5 text-grey-9">
        {{ data.name }}
        <span class="text-subtitle1">模块</span>
      </div>
    </q-card-section>
    <q-separator/>

    <q-card-section>
      <q-list>

        <q-item clickable class="q-pa-none">
          <q-item-section>
            <q-item-label>模型: User | Auth</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>


    </q-card-section>

    <q-separator/>

    <q-card-section class="q-gutter-x-sm">

      <q-icon name="exit_to_app" size="sm" :color="data.isExport ? 'positive' : 'negative'">
        <q-tooltip>是否导出{{ data.name }}Module.ts 文件</q-tooltip>
      </q-icon>

      <q-icon name="file_download" size="sm" :color="data.toList ? 'positive' : 'negative'">
        <q-tooltip>是否将 {{ data.name }}Module 加入到 ModulesList 列表</q-tooltip>
      </q-icon>

      <q-icon name="public" size="sm" :color="data.isGlobal ? 'positive' : 'negative'">
        <q-tooltip>是否使用 @Global 装饰器</q-tooltip>
      </q-icon>

    </q-card-section>

    <q-separator/>

    <q-card-actions align="right">
      <q-btn flat dense color="primary" label="编辑" :to="`/module/form/${data.name}`"></q-btn>
      <q-btn flat dense color="primary" label="改名"></q-btn>
      <q-btn flat dense color="primary" label="处理Model" :to="`/module/model/${data.name}`"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped>

</style>

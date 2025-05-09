<script setup lang="ts">
import {useDataStore} from "stores/data-store";
import {ref} from "vue";
import {ModelsItem} from "app/type/JsonFileDefine/Index";

const props = defineProps<{
  module: string;
  model: string;
}>()

const dataStore = useDataStore();
const data = ref<ModelsItem>(dataStore.getModel(props.module, props.model));

</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h5 text-grey-9">
        {{ data.name }}
        <span class="text-subtitle1">模型</span>
      </div>
    </q-card-section>
    <q-separator/>

    <q-card-section>
      <q-list>

        <q-item clickable class="q-pa-none">
          <q-item-section class="q-gutter-y-sm">
            <q-item-label>模型: Auth</q-item-label>
            <q-item-label caption>
              <q-icon name="exit_to_app" size="xs" color="positive">
                <q-tooltip>将会导出</q-tooltip>
              </q-icon>
            </q-item-label>
          </q-item-section>
        </q-item>

      </q-list>


    </q-card-section>

    <q-separator/>

    <q-card-section class="q-gutter-x-sm">

      <q-icon name="exit_to_app" size="sm" color="positive">
        <q-tooltip>将会导出</q-tooltip>
      </q-icon>

      <q-icon name="file_download" size="sm" color="positive">
        <q-tooltip>将会加入到modules列表</q-tooltip>
      </q-icon>

    </q-card-section>

    <q-separator/>

    <q-card-actions align="right">
      <q-btn flat dense color="primary" label="编辑"
             :to="`/model/form/${module}/${model}`"
      ></q-btn>
      <q-btn flat dense color="primary" label="处理字段"
             :to="`/model/attr/${module}/${model}`"
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped>

</style>

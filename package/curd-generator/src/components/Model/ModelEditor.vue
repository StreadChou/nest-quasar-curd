<script setup lang="ts">
import {useViewStore} from "stores/view-store";
import {ref} from "vue";
import {ProjectRecord, useDataStore} from "stores/data-store";
import {ProjectConfig} from "app/type/JsonFileDefine/Project";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import {ModelConfig} from "app/type/JsonFileDefine/Model";
import CreateModel from "components/Model/CreateModel.vue";
import AttrList from "components/Attr/AttrList.vue";
import {AttrConfig} from "app/type/JsonFileDefine/Attr";

const props = defineProps<{
  count: number,
  viewId: string,
  module: ModuleConfig,
  model: ModelConfig,
}>()
const dataStore = useDataStore();


const viewStore = useViewStore();
const projectRecord = ref<ProjectRecord>(dataStore.getProjectRecord(props.count));
const moduleConfig = ref<ModuleConfig>(projectRecord.value.json_data.modules[props.module.name] as ModuleConfig);
const modelConfig = ref<ModelConfig>(moduleConfig.value.models[props.model.name] as ModelConfig)

const form = ref<Partial<ModelConfig>>({
  name: modelConfig.value.name,
  dbName: modelConfig.value.dbName,
  joinModuleImports: modelConfig.value.joinModuleImports,

  exportController: modelConfig.value.exportController,
  controllerClassName: modelConfig.value.controllerClassName || "",
  curdPath: modelConfig.value.curdPath || "",
  joinModuleControllers: modelConfig.value.joinModuleControllers || true,

  exportService: modelConfig.value.exportService,
  serviceName: modelConfig.value.serviceName || "",
  joinModuleProviders: modelConfig.value.joinModuleProviders || true,
  joinModuleExports: modelConfig.value.joinModuleExports || true,

  attrs: modelConfig.value.attrs || [],
})

const save = () => {
  dataStore.updateModel(props.count, props.module.name, form.value)
}

</script>

<template>
  <div>
    <div class="row class bg-grey q-pa-sm">
      <q-space></q-space>
      <div class="q-gutter-x-sm">
        <CreateModel :count="count" :module="module"></CreateModel>
        <q-btn color="negative" dense size="sm" icon="close" @click="viewStore.closePanel(viewId)"></q-btn>
      </div>
    </div>
    <div class="row q-col-gutter-x-md">
      <div class="col">
        <AttrList v-model="form.attrs as Array<AttrConfig>"/>
      </div>

      <div class="col-3">
        <div>
          <q-input standout dense v-model="form.name" label="名称" :disable="true"></q-input>
        </div>

        <div>
          <q-input standout v-model="form.dbName" label="数据名字"/>
        </div>

        <div class="bg-grey-2 q-py-sm">
          <q-checkbox v-model="form.exportController" label="是否导出controller"></q-checkbox>
          <q-checkbox v-model="form.exportService" label="是否导出service"></q-checkbox>
        </div>


        <div class="bg-white border-title-box">
          <div class="title">Model定义</div>
          <div class="q-gutter-y-md">
            <q-input standout v-model="form.dbName" label="数据库的表名"/>
          </div>
        </div>


        <div class="bg-white border-title-box" v-if="form.exportController">
          <div class="title">Controller定义</div>
          <div class="q-gutter-y-md">

            <q-input dense standout v-model="form.controllerClassName" label="controller名称">
              <template #after>
                <q-btn class="full-height" color="primary" label="自动推算" @click="autoCalcControllerName"></q-btn>
              </template>
            </q-input>

            <q-input dense standout v-model="form.curdPath" label="Curd的路径">
              <template #after>
                <q-btn class="full-height" color="primary" label="自动推算" @click="autoCalcCurdPath"></q-btn>
              </template>
            </q-input>
          </div>
        </div>

        <div class="bg-white border-title-box" v-if="form.exportService">
          <div class="title">Service定义</div>
          <div class="q-gutter-y-md">
            <q-input standout dense v-model="form.serviceName" label="service的名字">
              <template #after>
                <q-btn class="full-height" color="primary" label="自动推算" @click="autoCalcServiceName"></q-btn>
              </template>
            </q-input>
          </div>
        </div>


      </div>

    </div>

    <div class="q-mt-md">
      <q-btn class="full-width" label="保存" color="primary" @click="save"></q-btn>
    </div>
  </div>
</template>

<style scoped>

</style>

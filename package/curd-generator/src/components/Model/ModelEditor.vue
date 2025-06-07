<script setup lang="ts">
import {useViewStore} from "stores/view-store";
import {ref} from "vue";
import {ProjectRecord, useDataStore} from "stores/data-store";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import {ModelConfig} from "app/type/JsonFileDefine/Model";
import CreateModel from "components/Model/CreateModel.vue";
import AttrList from "components/Attr/AttrList.vue";
import {AttrConfig} from "app/type/JsonFileDefine/Attr";
import ModelBaseInfo from "components/Model/ModelBaseInfo.vue";
import ControllerSetting from "components/Model/ControllerSetting.vue";
import ServiceSetting from "components/Model/ServiceSetting.vue";
import ConstantSetting from "components/Model/ConstantSetting.vue";

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

const form = ref<ModelConfig>({
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

  exportInterface: modelConfig.value.exportInterface,

  attrs: modelConfig.value.attrs || [],
  constant: modelConfig.value.constant || [],
})

const save = () => {
  dataStore.updateModel(props.count, props.module.name, form.value)
}

const tab = ref("ModelBaseInfo");

</script>

<template>
  <div>
    <div class="row class bg-grey q-pa-sm">
      <q-space></q-space>
      <div class="q-gutter-x-sm">
        <q-btn color="primary" dense size="sm" icon="save" @click="save"></q-btn>
        <CreateModel :count="count" :module="module"></CreateModel>
        <q-btn color="negative" dense size="sm" icon="close" @click="viewStore.closePanel(viewId)"></q-btn>
      </div>
    </div>
    <div>
      <q-splitter :model-value="10">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-teal">

            <q-tab name="ModelBaseInfo" label="基础信息"/>
            <q-tab name="AttrList" label="字段列表"/>

            <template v-if="form.exportController">
              <q-tab name="ControllerSetting" label="Controller设置" no-caps/>
            </template>

            <template v-if="form.exportService">
              <q-tab name="ServiceSetting" label="Service设置" no-caps/>
            </template>

            <template v-if="form.exportInterface">
              <q-tab name="InterfaceSetting" label="Interface设置" no-caps/>
            </template>


            <q-tab name="ConstantSetting" label="宏定义设置" no-caps/>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels v-model="tab" animated swipeable vertical
                        transition-prev="jump-up" transition-next="jump-up"
          >


            <q-tab-panel name="ModelBaseInfo" class="q-gutter-y-md">
              <ModelBaseInfo v-model="form"/>
            </q-tab-panel>

            <q-tab-panel name="AttrList" class="q-gutter-y-md">
              <AttrList :count="count" v-model="form.attrs as Array<AttrConfig>"/>
            </q-tab-panel>

            <q-tab-panel name="ControllerSetting" class="q-gutter-y-md">
              <ControllerSetting v-model="form"/>
            </q-tab-panel>

            <q-tab-panel name="ServiceSetting" class="q-gutter-y-md">
              <ServiceSetting v-model="form"/>
            </q-tab-panel>


            <q-tab-panel name="InterfaceSetting" class="q-gutter-y-md">
            </q-tab-panel>

            <q-tab-panel name="ConstantSetting" class="q-gutter-y-md">
              <ConstantSetting v-model="form"></ConstantSetting>
            </q-tab-panel>

          </q-tab-panels>
        </template>

      </q-splitter>
    </div>
  </div>
</template>

<style scoped>

</style>

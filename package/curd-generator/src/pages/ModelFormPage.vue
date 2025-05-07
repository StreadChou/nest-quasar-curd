<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useDataStore} from "stores/data-store";
import {ModelsItem} from "app/type/JsonFileDefine/Index";
import {useQuasar} from "quasar";

const route = useRoute();

const $q = useQuasar();
const dataStore = useDataStore();

const module = ref<string>(route.params.module as string)
const form = ref<ModelsItem>({})
// 是否可以改名
const canEditorName = ref(false);

const save = async () => {
  if (!form.value.name) {
    $q.notify({
      message: "请填写模型名称",
      color: "negative",
      position: "top-right",
      icon: "report_problem",
    });
    throw new Error("请填写模型名称")
  }
  dataStore.setModel(module.value, form.value);
  await dataStore.saveData()
};

const init = () => {
  const model = route.params.model as string
  // 如果是有model的话
  if (parseInt(model) !== 0) {
    const data = dataStore.getModel(module.value, model)
    form.value = JSON.parse(JSON.stringify(data));
  }

  form.value.exportController = "exportController" in form.value ? form.value.exportController : true;
  form.value.exportService = "exportService" in form.value ? form.value.exportService : true;

  if (!form.value.name) canEditorName.value = true;
}


const getModelName = () => {
  let name: string = form.value.name || "";
  name = name.replace("Model", "")
  name = name.replace("model", "")
  name = name.trim();
  return name || "";
}

const autoCalcControllerName = () => {
  let name: string = getModelName();
  if (!name) return null;
  form.value.controllerClassName = `${name}Controller`;
}

const autoCalcCurdPath = () => {
  let name: string = getModelName();
  if (!name) return null;
  form.value.curdPath = `curd/${name}`;
}

const autoCalcServiceName = () => {
  let name: string = getModelName();
  if (!name) return null;
  form.value.serviceName = `${name}Service`;
}


onMounted(() => {
  init();
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

    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <div>
          <q-input standout v-model="form.name" label="Model名称" :disable="!canEditorName"/>
        </div>

        <div>
          <q-input standout v-model="form.entityClassName" label="Entity Class Name"/>
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

      <div class="q-mt-md">
        <q-btn class="full-width" label="保存" color="primary" @click="save"></q-btn>
      </div>

    </div>
  </q-page>
</template>

<style scoped>

</style>

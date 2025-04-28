<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ModulesItem} from "app/type/JsonFileDefine/Index";
import {useRoute} from "vue-router";
import {useDataStore} from "stores/data-store";
import {useQuasar} from "quasar";

const $q = useQuasar();
const route = useRoute();

const form = ref<ModulesItem>({})
const dataStore = useDataStore();
// 是否可以改名
const canEditorName = ref(false);

const save = async () => {
  dataStore.data.modules = dataStore.data.modules || {};
  if (!form.value.name) {
    $q.notify({
      message: "请填写模块名称",
      color: "negative",
      position: "top-right",
      icon: "report_problem",
    });
    throw new Error("请填写模块名称")
  }
  dataStore.data.modules[form.value.name] = form.value
  await dataStore.saveData()
}

const init = () => {
  const module = route.params.module;

  // 如果是有model的话
  if (parseInt(module) !== 0) {
    const data = dataStore.data.modules[module];
    form.value = JSON.parse(JSON.stringify(data));
  }

  form.value.isExport = "isExport" in form.value ? form.value.isExport : true;
  form.value.toList = "toList" in form.value ? form.value.toList : true;
  form.value.isGlobal = "isGlobal" in form.value ? form.value.isGlobal : false;

  if (!form.value.name) canEditorName.value = true;
}

onMounted(() => {
  init();
})

</script>

<template>
  <q-page>
    <q-banner dense inline-actions class="text-white bg-teal">
      您正在 编辑/新增 modules
      <template v-slot:action>
        <q-btn flat color="white" label="返回到Modules列表" to="/"/>
        <q-btn flat color="white" label="预览"/>
      </template>
    </q-banner>

    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <div>
          <q-input standout v-model="form.name" label="Modules名称" :disable="!canEditorName"/>
        </div>

        <div class="bg-grey-2 q-py-sm">
          <q-checkbox v-model="form.isExport" label="是否导出"></q-checkbox>
          <q-checkbox v-model="form.toList" label="是否加入到 ModuleList "></q-checkbox>
          <q-checkbox v-model="form.isGlobal" label="是否全局 "></q-checkbox>
        </div>

      </div>

      <div class="q-mt-md">
        <q-btn class="full-width" label="保存" color="primary" @click="save"></q-btn>
      </div>


      <q-separator class="q-my-md"></q-separator>

    </div>


  </q-page>
</template>

<style scoped>

</style>

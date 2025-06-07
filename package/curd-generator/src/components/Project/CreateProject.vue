<script setup lang="ts">
import {ref} from "vue";
import {InvokeProxy} from "src/library/InvokeProxy";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";
import {useDataStore} from "stores/data-store";

const dataStore = useDataStore();
const dialog = ref(false);

const form = ref({
  name: "项目1",
  dir: ""
})

const selectDir = async () => {
  const reply = await InvokeProxy("FileHandler.openFileDialog")
  if (reply.code != 0) return InvokeErrorHandler(reply);
  const file = reply?.data?.file;
  if (!file) return null;
  form.value.dir = file;
}

const clickOk = async () => {
  const reply = await InvokeProxy("AppHandler.createProject", form.value.dir, form.value.name)
  if (reply.code != 0) return InvokeErrorHandler(reply);
  await dataStore.openProject(reply.data.targetPath)
  dialog.value = false;
}
</script>

<template>
  <q-btn round dense flat color="grey-8" icon="add" @click="dialog = true">
    <q-tooltip>创建新项目</q-tooltip>
  </q-btn>

  <q-dialog v-model="dialog" backdrop-filter="blur(4px) saturate(150%)" persistent>
    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6 text-center">创建新项目</div>
      </q-card-section>

      <div class="q-pb-md">
        <q-separator></q-separator>
      </div>

      <q-card-section class="q-pt-none q-gutter-y-md">
        <q-input standout v-model="form.name"
                 label="请设置项目名称(请尽量保证唯一)"
        />
        <q-input standout v-model="form.dir"
                 label="请选择项目文件文件路径"
        >
          <template #append>
            <q-btn flat dense label="选择" @click="selectDir"/>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="取消" color="primary" v-close-popup/>
        <q-btn flat label="确定" color="primary" @click="clickOk"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<style scoped>

</style>

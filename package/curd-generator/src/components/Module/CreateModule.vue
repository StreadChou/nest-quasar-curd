<script setup lang="ts">
import {ref} from "vue";
import {useDataStore} from "stores/data-store";

const dataStore = useDataStore();
const props = defineProps<{
  count: number,
}>()

const dialog = ref(false);

const form = ref({
  name: "Module",
})


const clickOk = async () => {
  await dataStore.createModule(props.count, form.value.name)
}

const projectRecord = ref(dataStore.getProjectRecord(props.count));

</script>

<template>
  <q-btn dense size="sm" icon="add" color="primary" @click="dialog = true">
    <q-tooltip>在{{ projectRecord.json_data.project.name }}中创建Module</q-tooltip>
  </q-btn>

  <q-dialog v-model="dialog" backdrop-filter="blur(4px) saturate(150%)" persistent>
    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6 text-center">在{{ projectRecord.json_data.project.name }}中创建Module</div>
      </q-card-section>

      <div class="q-pb-md">
        <q-separator></q-separator>
      </div>

      <q-card-section class="q-pt-none q-gutter-y-md">
        <q-input standout v-model="form.name"
                 label="请输入modules名字(项目内保证唯一)"
        >
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

<script setup lang="ts">
import {useQuasar} from "quasar";
import {useTableStore} from "stores/table-store";
import {onMounted, ref} from "vue";
import {Table} from "app/src-ssr/types/Table";
import MonacoEditor from "components/MonacoEditor.vue";


const $q = useQuasar();
const tableStore = useTableStore();

const form = ref<Partial<Table>>()
const CodeEditorRef = ref();

const tab = ref("base")
const code = ref("");
const language = ref("typescript");
const theme = ref("vs-dark");

let editor;

const initEditor = () => {

}


onMounted(() => {

})

</script>

<template>
  <q-card>

    <q-splitter model-value="10">

      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="base" icon="mail" label="基础"/>
          <q-tab name="constant" icon="alarm" label="数据表"/>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="base">

            <q-card-section class="row q-col-gutter-x-md">
              <div class="col">
                <q-input v-model="tableStore.nowEditTableForm.Name" label="名称" standout dense/>
              </div>
              <div class="col">
                <q-input v-model="tableStore.nowEditTableForm.ClassName" label="类名" standout dense/>
              </div>
              <div class="col">
                <q-input v-model="tableStore.nowEditTableForm.Restful" label="Restful接口" standout dense/>
              </div>
            </q-card-section>

          </q-tab-panel>

          <q-tab-panel name="constant">
            <q-card-section style="height: 300px">
              <MonacoEditor v-model="tableStore.nowEditTableForm.Constants"
                            :editorConfig="{theme: theme, language: language}"></MonacoEditor>
            </q-card-section>
          </q-tab-panel>

        </q-tab-panels>
      </template>

    </q-splitter>


    <q-card-section align="right">
      <q-btn flat dense label="移除" color="negative"/>
      <q-btn flat dense label="关闭" color="dark"/>
      <q-btn flat dense label="还原" color="secondary"/>
      <q-btn flat dense label="保存" color="primary" @click="tableStore.saveNowEditor()"/>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>

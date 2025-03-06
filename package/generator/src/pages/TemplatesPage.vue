<script setup lang="ts">

import {ref} from "vue";
import MonacoEditor from "components/MonacoEditor.vue";
import {useTableStore} from "stores/table-store";
import {Template} from "app/src-ssr/types/Template";

const splitterModel = ref(10)
const table = ref("");

const options = ref([
  {label: "CurdServices", value: "CurdServices"},
  {label: "RequestConstant", value: "RequestConstant"},
  {label: "CurdController", value: "CurdController"},
])

const tableStore = useTableStore();
for (const item of options.value) {
  const key = item.value as keyof Template;
  tableStore.templates[key] = tableStore.templates[key] || "";
}


</script>

<template>
  <q-page class="full-height">
    <q-splitter v-model="splitterModel" class="full-height">

      <template v-slot:before>
        <q-tabs v-model="table" vertical class="text-teal">
          <template v-for="item of options">
            <q-tab :name="item.value" no-caps :label="item.label"/>
          </template>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="table" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <template v-for="item of options">
            <q-tab-panel :name="item.value" style="height: 80vh">
              <MonacoEditor
                v-model="tableStore.templates[item.value as keyof Template]"
                :editorConfig="{theme: 'vs-dark', language: 'typescript'}"
              >
              </MonacoEditor>
            </q-tab-panel>
          </template>
        </q-tab-panels>
      </template>

    </q-splitter>
  </q-page>
</template>

<style scoped>

</style>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card style="min-width: 50vw;">
      <q-card-section>
        <div class="text-h6">字段预览</div>
      </q-card-section>

      <q-separator/>

      <q-card-section style="max-height: 50vh" class="scroll q-gutter-y-md">
        <q-input v-model="importFiled" standout label="导入区域" autogrow type="textarea"></q-input>
        <q-input v-model="columnsFiled" standout label="字段区域" autogrow type="textarea"></q-input>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn flat label="关闭" color="dark" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {ref} from "vue";
import {Table, TableColumns} from "app/src-ssr/types/Table";
import {ColumnsGeneratorContext} from "app/src-ssr/generator/columns/ColumnsGenerator";


const $q = useQuasar();
defineEmits([
  ...useDialogPluginComponent.emits
])
const {dialogRef, onDialogHide} = useDialogPluginComponent()

const props = defineProps<{ columns_key: string, columns_form: TableColumns }>()

const columnsFiled = ref("");
const importFiled = ref("");

const generator = new ColumnsGeneratorContext(props.columns_key, props.columns_form)
columnsFiled.value = generator.getEntityString();
importFiled.value = generator.getBackendImportString();

</script>

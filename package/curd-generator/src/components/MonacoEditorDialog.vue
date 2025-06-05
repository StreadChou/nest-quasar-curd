<script lang="ts" setup>
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {onBeforeUnmount, onMounted, ref, useTemplateRef} from "vue";
import MonacoEditor from "components/VMonacoEditor.vue";
import * as monaco from 'monaco-editor'


const $q = useQuasar();
const props = defineProps<{ data: string }>()
defineEmits([
  ...useDialogPluginComponent.emits
])

const form = ref<string>(props.data);

const {dialogRef, onDialogHide, onDialogOK} = useDialogPluginComponent()

async function onOKClick() {
  onDialogOK(form.value)
}

const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
  console.log('editor实例加载完成', editor)
}


</script>

<template>
  <q-dialog ref="dialogRef" @hide="onHide" persistent full-width>

    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">增加Table</div>
      </q-card-section>


      <q-separator/>

      <q-form @submit="onOKClick">

        <q-card-section style="height: 50vh" class="scroll">
          345
             <MonacoEditor
               v-model="form"
               language="typescirpt"
               height="500px"
               style="margin-top: 40px"
               @editor-mounted="editorMounted"
              ></MonacoEditor>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="关闭" color="dark" v-close-popup/>
          <q-btn flat label="保存" color="primary" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>

  </q-dialog>
</template>

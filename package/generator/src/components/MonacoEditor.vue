<template>
  <q-resize-observer @resize="handleResize"/>
  <div class="fit" ref="containerEl"></div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import type {editor as Editor} from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

const props = defineProps<{
  modelValue?: string
  editorConfig?: Editor.IStandaloneDiffEditorConstructionOptions &
    Record<any, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', data: string): void
}>()

const containerEl = ref()

let editor: Editor.IStandaloneCodeEditor | null = null

const defaultConfig = {
  language: 'javascript',
  theme: 'vs',
}

onMounted(async () => {
  if (containerEl.value) {
    const monaco = await import('monaco-editor')
    self.MonacoEnvironment = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getWorker: function (workerId, label) {
        switch (label) {
          case 'json':
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return new jsonWorker()
          case 'css':
          case 'scss':
          case 'less':
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return new cssWorker()
          case 'html':
          case 'handlebars':
          case 'razor':
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return new htmlWorker()
          case 'typescript':
          case 'javascript':
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return new tsWorker()
          default:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return new editorWorker()
        }
      },
    }
    editor = monaco.editor.create(containerEl.value, {
      ...defaultConfig,
      ...props.editorConfig,
      value: props.modelValue,
    })
    console.log(editor)
    editor.onDidChangeModelContent((e) => {
      emit('update:modelValue', editor?.getValue?.() ?? '')
    })
  }
})

onBeforeUnmount(() => {
  editor?.dispose?.()
})

watch(
  props.editorConfig,
  (newVal) => {
    if (editor) {
      editor.updateOptions(newVal)
    }
  },
  {
    deep: true,
  }
)

function handleResize() {
  editor?.layout?.()
}
</script>

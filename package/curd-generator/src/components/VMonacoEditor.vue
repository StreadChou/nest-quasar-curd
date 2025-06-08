<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { editorProps } from 'components/editorProps'

// 接收 props 和 emits
const props = defineProps(editorProps)
const emit = defineEmits(['update:modelValue', 'change', 'editor-mounted'])

let editor: monaco.editor.IStandaloneCodeEditor
const codeEditBox = ref<HTMLDivElement | null>(null)

const init = () => {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true
  })

  editor = monaco.editor.create(codeEditBox.value!, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    ...props.options
  })

  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    emit('update:modelValue', value)
    emit('change', value)
  })

  emit('editor-mounted', editor)
}

// 同步外部 modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor) {
      const value = editor.getValue()
      if (newValue !== value) {
        editor.setValue(newValue)
      }
    }
  }
)

// 动态更新编辑器配置
watch(
  () => props.options,
  (newOptions) => {
    editor.updateOptions(newOptions)
  },
  { deep: true }
)

// 切换语言
watch(
  () => props.language,
  (newLang) => {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, newLang)
    }
  }
)

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  editor.dispose()
})
</script>

<style lang="scss" scoped>
.codeEditBox {
  width: v-bind(width);
  height: v-bind(height);
}
</style>

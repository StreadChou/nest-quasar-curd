<script setup lang="ts">
import {ref, watch} from "vue";
import {ConstantConfig, ModelConfig} from "app/type/JsonFileDefine/Model";
import {useQuasar} from "quasar";
import {UserInputError} from "src/app/ErrorHandler/UserInputError";
import MonacoEditorDialog from "components/MonacoEditorDialog.vue";
import MonacoEditor from "components/VMonacoEditor.vue";
import {InvokeProxy} from "src/library/InvokeProxy";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";

const $q = useQuasar();
const props = defineProps<{
  modelValue: ModelConfig
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ModelConfig>(props.modelValue);
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


const add = () => {
  $q.dialog({
    title: '请输入文件名字',
    prompt: {
      model: '.constant.ts',
      standout: true,
      type: 'text'
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    if (!model.value.constant) model.value.constant = [];
    const old = model.value.constant.find(ele => ele.name == data);
    if (old) throw new UserInputError("文件已经存在")

    model.value.constant.push({
      name: data,
      value: "",
      exports: []
    })
  })
}

const form = ref<ConstantConfig | undefined>(undefined);
const startEndEditor = async (item?: ConstantConfig) => {
  if (item) {
    form.value = item;
    return null;
  } else if (form.value) {
    const old = model.value.constant.find(ele => ele.name == form.value?.name);
    if (old) {
      const reply = await InvokeProxy("AppHandler.analysisTsExport", form.value.value)
      if (reply.code != 0) return InvokeErrorHandler(reply);
      form.value.exports = reply.data.exports;
      old.value = form.value.value;
    }
    form.value = undefined;
  }
}


</script>


<template>
  <div>
    <q-markup-table flat dense separator="cell" bordered>
      <tbody>
      <template v-for="item of model.constant">
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.exports.map(ele=> ele.name) }}</td>
          <td>
            <template v-if="form">
              <template v-if="form.name == item.name">
                <q-btn flat dense color="default" label="退出编辑" @click="startEndEditor()"></q-btn>
              </template>
            </template>
            <template v-else>
              <q-btn flat dense color="primary" label="编辑" @click="startEndEditor(item)"></q-btn>
            </template>
          </td>
        </tr>
      </template>
      <tr>
        <td colspan="3">
          <q-btn class="full-width" flat label="新增" @click="add"></q-btn>
        </td>
      </tr>
      </tbody>
    </q-markup-table>
    <div style="background: rgb(30,30,30)" v-if="form">
      <div class="text-white q-px-md">文件:</div>
      <MonacoEditor
        v-model="form.value"
        language="typescript"
        height="500px"
      ></MonacoEditor>
    </div>

  </div>
</template>

<style scoped>

</style>

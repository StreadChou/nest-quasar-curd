<script setup lang="ts">
import {ref, watch} from "vue";
import {ConstantConfig, ModelConfig} from "app/type/JsonFileDefine/Model";
import {useQuasar} from "quasar";
import {UserInputError} from "src/app/ErrorHandler/UserInputError";
import MonacoEditorDialog from "components/MonacoEditorDialog.vue";

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

const startEditor = (item: ConstantConfig) => {
  $q.dialog({
    component: MonacoEditorDialog,
    componentProps: {
      data: item.value,
    }
  })
}

</script>


<template>
  <div>
    <q-markup-table flat dense separator="cell" bordered>
      <tbody>
      <template v-for="item of model.constant">
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.exports }}</td>
          <td>
            <q-btn label="编辑" @click="startEditor(item)"></q-btn>
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
  </div>
</template>

<style scoped>

</style>

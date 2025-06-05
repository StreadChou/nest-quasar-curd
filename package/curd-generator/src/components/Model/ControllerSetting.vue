<script setup lang="ts">
import {ref, watch} from "vue";
import {ModelConfig} from "app/type/JsonFileDefine/Model";

const props = defineProps<{
  modelValue: ModelConfig
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ModelConfig>(props.modelValue);
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})
</script>

<template>

  <q-input dense standout v-model="model.controllerClassName" label="controller名称">
    <template #after>
      <q-btn class="full-height" color="primary" label="自动推算" @click="autoCalcControllerName"></q-btn>
    </template>
  </q-input>

  <q-input dense standout v-model="model.curdPath" label="Curd的路径">
    <template #after>
      <q-btn class="full-height" color="primary" label="自动推算" @click="autoCalcCurdPath"></q-btn>
    </template>
  </q-input>

</template>

<style scoped>

</style>

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

  <q-input standout dense v-model="model.serviceName" label="service的名字">
    <template #after>
      <q-btn class="full-height" color="primary" label="自动推算" @click="autoCalcServiceName"></q-btn>
    </template>
  </q-input>

</template>

<style scoped>

</style>

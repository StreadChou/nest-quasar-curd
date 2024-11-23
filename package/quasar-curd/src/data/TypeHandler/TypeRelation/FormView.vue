<script setup lang="ts">
import {computed, ref} from "vue";
import {ColumnsDefine, FormItemProps} from "../../../index";
import {AbstractTypeHandler} from "../AbstractTypeHandler";

const props = defineProps<FormItemProps>();
const handler = ref<AbstractTypeHandler>(props.handler);
const column = ref<ColumnsDefine>(handler.value.column)


const emits = defineEmits<{ (e: 'update:modelValue', value: object): void; }>();

// 使用 computed 属性来处理 JSON 编辑
const data = computed({
  get: () => {
    // 将 modelValue 转换为 JSON 字符串以便编辑
    return props.modelValue ? JSON.stringify(props.modelValue, null, 2) : '';
  },
  set: (value) => {
    try {
      const parsedValue = JSON.parse(value);
      // 将解析后的对象传递回父组件
      emits('update:modelValue', parsedValue);
    } catch (error) {
      console.error("Invalid JSON input:", error);
      // 可以在这里处理错误，比如展示错误信息
    }
  }
});

// 初始化数据
if (!props.modelValue) {
  // 如果没有传入模型值，使用一个默认对象
  emits('update:modelValue', { });
}
</script>

<template>
  <q-input v-model="data"
           standout :label="`${column.label} (${columns_key})`"
           clearable
           :disable="handler.isDisable(create_or_update)">
  </q-input>
</template>

<style scoped>
</style>
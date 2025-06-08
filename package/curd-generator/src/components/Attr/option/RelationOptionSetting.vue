<script setup lang="ts">
import {useQuasar} from "quasar";
import {ref, watch} from "vue";
import {RelationOptions} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeRelation/RelationOptions";

const $q = useQuasar();
const props = defineProps<{
  modelValue: RelationOptions | undefined
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<RelationOptions>(props.modelValue || {});
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})
</script>

<template>
  <div class="q-gutter-y-sm">
    <q-checkbox v-model="model.eager" label="是否始终包含 (eager)"/>
    <q-checkbox v-model="model.lazy" label="是否懒加载 (lazy)"/>
  </div>
</template>

<style scoped>

</style>

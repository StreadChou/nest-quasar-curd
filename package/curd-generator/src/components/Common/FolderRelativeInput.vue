<script setup lang="ts">
import {ref, watch} from "vue";
import {InvokeProxy} from "src/library/InvokeProxy";

const props = defineProps<{
  count: number,
  modelValue: string | undefined,
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<string>(props.modelValue || "");
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


const isDragging = ref(false)

const selectBackendPath = async () => {
  const pathReply = await InvokeProxy("FileHandler.openDirSelectDialog")
  console.log(pathReply);
}


const drop = async (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  const absPath = await InvokeProxy("FileHandler.getPathForFile", files[0])
  console.log(absPath)
}


</script>

<template>
  <div class="row items-stretch q-gutter-sm">
    <div class="col">
      <q-input
        standout
        dense
        v-model="model"
        label="后端导出路径(相对于配置文件)"
        class="full-height"
      />
    </div>
    <div class="self-stretch">
      <q-btn
        icon="folder"
        flat
        color="primary"
        class="border full-height"
        @click="selectBackendPath"
      >
        <q-tooltip>点击此处打开选择框</q-tooltip>
      </q-btn>
    </div>
    <div class="self-stretch">
      <q-icon
        class="drop-zone full-height"
        name="cloud_upload"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="drop"
        :class="{ 'drag-active': isDragging }"
      >
        <q-tooltip>拖拽此处快速选择</q-tooltip>
      </q-icon>
    </div>
  </div>
</template>


<style scoped>
.full-height {
  height: 100%;
}

.border {
  border: 2px dashed #ccc;
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s;
}

.drop-zone.drag-active {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
}

</style>


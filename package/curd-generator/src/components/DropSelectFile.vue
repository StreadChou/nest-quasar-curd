<script setup lang="ts">


import {ref} from "vue";
import {InvokeProxy} from "src/library/InvokeProxy";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";

const isDragging = ref(false)
const emit = defineEmits(["selectFile"])

const selectFile = async () => {
  const reply = await InvokeProxy("FileHandler.openFileDialog")
  if (reply.code != 0) return InvokeErrorHandler(reply);
  const file = reply?.data?.file;
  if (!file) return null;
  emit("selectFile", reply.data.file)
}

const drop = async (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  const absPath = await InvokeProxy("FileHandler.getPathForFile", files[0])
  emit("selectFile", absPath)
}

</script>

<template>
  <div
    class="drop-zone"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="drop"
    :class="{ 'drag-active': isDragging }"
  >
    <q-icon name="cloud_upload" size="48px"/>
    <div class="text-h6">拖拽文件到此处</div>
    <div class="text-subtitle1">或点击选择文件</div>

    <q-btn label="选择文件" color="primary" @click="selectFile"/>
  </div>
</template>

<style scoped>
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
}

.drop-zone.drag-active {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
}
</style>

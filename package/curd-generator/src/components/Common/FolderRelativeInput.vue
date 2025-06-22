<script setup lang="ts">
import {ref, watch} from "vue";
import {InvokeProxy} from "src/library/InvokeProxy";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";
import {useDataStore} from "stores/data-store";
import {ElectronRequest} from "src/app/ElectronApi/Window";

const props = defineProps<{
  modelValue: string | undefined,
  count: number;
  label: string;
}>()
const dataStore = useDataStore();

const emit = defineEmits(["update:modelValue"])
const model = ref<string>(props.modelValue || "");
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})

const projectRecord = ref(dataStore.getProjectRecord(props.count));


const isDragging = ref(false)

const selectBackendPath = async () => {
  const pathReply = await InvokeProxy("FileHandler.openDirSelectDialog")
  if (pathReply.code != 0) return InvokeErrorHandler(pathReply);
  if (projectRecord.value?.file_path) {
    const res = await ElectronRequest("PathHandler.getRelativePath", {
      from: projectRecord.value.file_path,
      target: pathReply.data.dir
    })
    model.value = res;
    return null;
  }

  model.value = pathReply.data.dir;
  return null;
}


const drop = async (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  const absPath = await InvokeProxy("FileHandler.getPathForFile", files[0])
  console.log({absPath})
  model.value = absPath;
}


</script>

<template>
  <div class="row items-stretch q-gutter-sm">
    <div class="col">
      <q-input standout dense v-model="model" :label="label" class="full-height"/>
    </div>
    <div
      :class="{'self-stretch': true, border: true, 'drag-active': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="drop"

    >
      <q-btn icon="folder" flat color="primary" class=" full-height" @click="selectBackendPath">
        <q-tooltip>点击此处打开选择框</q-tooltip>
      </q-btn>
    </div>
    <!--    <div class="self-stretch">-->
    <!--      <q-icon-->
    <!--        class="drop-zone full-height"-->
    <!--        name="cloud_upload"-->
    <!--        -->
    <!--        -->
    <!--        -->
    <!--        -->
    <!--      >-->
    <!--        <q-tooltip>拖拽此处快速选择</q-tooltip>-->
    <!--      </q-icon>-->
    <!--    </div>-->
  </div>
</template>


<style scoped>
.full-height {
  height: 100%;
}

.border {
  border: 2px dashed #ccc;
}

.drag-active {
  border-color: #1976d2;
}

</style>


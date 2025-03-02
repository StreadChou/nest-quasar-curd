<script setup lang="ts">
import {ImportConfigInterface, TableColumnsExtension} from "app/src-ssr/types/Table";
import {onMounted, ref, watch} from "vue";
import {
  WhenColumnIsComplexTypeList,
} from "app/src-ssr/types/SimpleColumnType";
import ImportEditorDialog from "components/Columns/ImportExtension/ImportEditorDialog.vue";
import {useQuasar} from "quasar";
import {useTableStore} from "stores/table-store";

const $q = useQuasar();
const tableStore = useTableStore();

const props = defineProps<{
  title?: string,
  toEnv?: "frontend" | "backend"
  modelValue?: TableColumnsExtension
}>()


const emit = defineEmits(["update:modelValue"])
const model = ref<TableColumnsExtension>(props.modelValue || {});

watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


onMounted(() => {
  if (!("relation_in_generator" in model.value)) model.value.relation_in_generator = true;
})

</script>

<template>
  <div class="q-py-sm" style="border: dashed 1px gray">
    <div class="q-gutter-y-sm q-px-sm">
      <div class="q-pl-xs text-grey-9 q-mb-xs">{{ props.title ? props.title : '一对多扩展编辑' }}</div>

      <div>
        <q-checkbox v-model="model.relation_in_generator" label="关联的对象是否来自本系统"/>
      </div>
      <template v-if="model.relation_in_generator">
        <q-select v-model="model.relation_entity"
                  :options="tableStore.tableOptions"
                  standout label="请选择表名"
                  emit-value map-options
        />
        <q-select v-model="model.relation_entity_key"
                  :options="Object.keys(tableStore.tableList.find(ele=> ele.ClassName == model.relation_entity)?.columns || {})"
                  standout label="请选择字段"
        />
      </template>
      <template v-else>
        <div class="row q-gutter-x-md">
          <div class="col">
            <q-input v-model="model.relation_entity" clearable standout type="text" dense label="请输入实体名字"/>

          </div>
          <div class="col">
            <q-input v-model="model.relation_import_string" clearable standout type="text" dense
                     label="请输入导入路径"/>
          </div>
        </div>
        <q-input v-model="model.relation_entity_key" clearable standout type="text" dense
                 label="请输入外键"/>
      </template>


    </div>
  </div>


</template>

<style scoped>

</style>

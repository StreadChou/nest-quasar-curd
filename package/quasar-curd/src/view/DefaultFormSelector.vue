<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import type {AxiosInstance} from "axios";
import {FormItemProps} from "../define/FormPageDefine";
import {AbstractTypeHandler, AbstractViewData} from "../data";
import {ColumnsDefine, FindAllBody} from "../../../link";

type EntityType = any;

interface Props extends FormItemProps {
  /** 使用的数据处理器 */
  view_data_instance: AbstractViewData,
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void; }>();
const data = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

const handler = ref<AbstractTypeHandler>(props.handler);
const column = ref<ColumnsDefine>(handler.value.column)
const editor_bind = ref(column.value.frontend?.editor_bind || {
  "option-label": "id",
  "map-options": true,
  standout: true,
  clearable: true,
})

// 数据源
const ViewData = ref<AbstractViewData<EntityType>>(props.view_data_instance);

const options = ref<EntityType[]>([]);
const total = ref(0);

const loading = ref(false);
const requestBody = ref<FindAllBody>({
  page: 1,
  pageSize: 30,
})
// 如果有初始值, 就不要再去获取这个值了(会优先获取)
if (props?.modelValue?.id) requestBody.value.whereNot = {id: props.modelValue.id}


const onScroll = ({to, ref}) => {
  const lastIndex = options.value.length - 1

  // 已经超过限制了不处理
  if (lastIndex >= total.value) return null;
  // 如果需要的数据已经有了. 不处理
  if (to < lastIndex) return null;


  if (loading.value !== true) {
    loading.value = true
    requestBody.value.page += 1;
    ViewData.value.fetch_entity_list(requestBody.value).then(response => {
      options.value = options.value.concat(response.data.data)
      ref.refresh()
      loading.value = false
    })
  }
}

onMounted(async () => {
  if (props?.modelValue?.id) {
    const response = await ViewData.value.fetch_entity_one(props.modelValue.id);
    options.value.push(response.data);
  }

  const response = await ViewData.value.fetch_entity_list(requestBody.value)
  options.value = options.value.concat(response.data.data)
  total.value = response.data.pagination.total - 1;
})

</script>

<template>
  <q-select v-model="data"
            :options="options"
            v-bind="editor_bind"
            @virtual-scroll="onScroll"
            :label="`${column.label}(${columns_key})(请直接输入以搜索)`"
            :disable="handler.isDisable(create_or_update)"
  >

  </q-select>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {AbstractTypeHandler, type FindAllBody} from "@stread/quasar-curd"
import {UserViewData} from "./UserViewData";
import type {UserInterface} from "./User.interface";
import type {AxiosInstance} from "axios";

interface Props {
  api: AxiosInstance,
  /** Form 使用 v-model 绑定的内容 */
  modelValue: any | undefined,

  /** 表单是在创建还是在更新 */
  create_or_update: "create" | "update",
  /** 编辑的是 实体的某个字段  */
  columns_key: string,
  /** 表单的数据结构体  */
  form: object,
  /** 字段的处理器  */
  handler: AbstractTypeHandler,
}

const props = defineProps<Props>();
const handler = ref<AbstractTypeHandler>(props.handler);
const column = ref<ColumnsDefineInFrontend>(handler.value.column)


const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void; }>();

const data = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

const ViewData = ref(new UserViewData(props.api));

const options = ref<UserInterface[]>([]);
const requestBody = ref<FindAllBody>({
  page: 1,
  pageSize: 30,
})

// 如果有初始值, 就不要再去获取这个值了
if (props?.modelValue?.id) {
  requestBody.value.whereNot = {id: props.modelValue.id}
}

const total = ref(0);

const loading = ref(false);

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
            @virtual-scroll="onScroll"
            map-options
            option-label="id"


            filled
            clearable
            standout
            :label="`${column.label}(${columns_key})(请直接输入以搜索)`"
            :disable="handler.isDisable(create_or_update)"
  >

  </q-select>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {AxiosInstance} from "axios";
import {AbstractViewData, FindAllBody, FindAllResponse} from "../index";
import {ref, toRefs} from "vue";

type EntityType = any;

/** Table 的绑定 */
interface TableBind {
  flat: boolean;
  dense: boolean;
  dark: boolean;
  bordered: boolean;
  square: boolean;

  separator: 'horizontal' | 'vertical' | 'cell' | 'none',
  "wrap-cells": boolean;

  class: string,
  style: Record<string, string>
}

/** Props 类型定义 */
interface Props {
  /** Ajax 实例 */
  api: AxiosInstance;
  /** 请求的参数 */
  requestBody?: FindAllBody,
  /** 使用的视图数据处理器 */
  ViewData?: AbstractViewData,
  /** 表格绑定 */
  table_bind?: TableBind
  /** 表格 head 绑定 */
  thead_bind?: Record<string, any>
  /** 表格 body 绑定 */
  tbody_bind?: Record<string, any>
  /** 表格 tr 绑定 */
  tr_bind?: Record<string, any>
  /** 表格 td 绑定 */
  td_bind?: Record<string, any>
  /** 表格 th 绑定 */
  th_bind?: Record<string, any>

}

const props = withDefaults(defineProps<Props>(), {
  requestBody: {},
  table_bind: () => ({
    class: "text-left",
    flat: true,
    bordered: true,
    separator: "cell",
    "wrap-cells": true,
  })
})

const {requestBody} = toRefs(props);
const ViewData = ref<AbstractViewData<EntityType>>(props.ViewData)

const entityList = ref<FindAllResponse<EntityType>>({data: []});


/** 请求数据 */
const fetch_entity = async () => {
  const axios_response = await ViewData.value.fetch_entity_list(requestBody.value);
  entity_list.value = axios_response.data;
}

</script>

<template>
  <div class="full-width">
    <q-markup-table v-bind="table_bind || {}">
      <thead v-bind="thead_bind || {}">
      <tr v-bind="tr_bind || {}">
        <th v-bind="th_bind || {}">
          123
        </th>
      </tr>

      </thead>
      <tbody v-bind="tbody_bind || {}">
      <template v-for="n in 10">
        <tr v-bind="tr_bind || {}">
          <td>1</td>
          <td>12</td>
          <td>12</td>
          <td>12</td>
        </tr>
      </template>

      </tbody>
    </q-markup-table>
  </div>
</template>

<style scoped>

</style>
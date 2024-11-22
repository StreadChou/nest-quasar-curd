<script setup lang="ts">
import {AbstractViewData, FindAllResponse, HomeProps} from "../index";
import {onMounted, ref, toRefs} from "vue";

type EntityType = any;


const props = withDefaults(defineProps<HomeProps>(), {
  request_body: {},
  table_bind: () => ({
    class: "text-left",
    flat: true,
    bordered: true,
    separator: "cell",
    "wrap-cells": true,
  })
})

const {request_body} = toRefs(props);
const ViewData = ref<AbstractViewData<EntityType>>(props.view_data ? new props.view_data(props.api) : undefined);

const EntityList = ref<FindAllResponse<EntityType>>({data: []});
const show_columns = ref<string[]>(ViewData.value.HomeShowColumns)


/** 请求数据 */
const fetch_entity = async () => {
  console.log(props)
  if (!ViewData.value?.fetch_entity_list) return null;

  const axios_response = await ViewData.value.fetch_entity_list(request_body.value);
  EntityList.value = axios_response.data;
}


onMounted(() => {
  fetch_entity();
})

</script>

<template>
  <div class="full-width">
    <q-markup-table v-bind="table_bind || {}">
      <thead v-bind="thead_bind || {}">
      <tr v-bind="tr_bind || {}">
        <template v-for="show_column of show_columns">
          <th v-bind="th_bind || {}">
            {{ ViewData.columns[show_column].label }}
          </th>
        </template>

      </tr>

      </thead>
      <tbody v-bind="tbody_bind || {}">
      <template v-for="entity of EntityList.data">
        <tr v-bind="tr_bind || {}">
          <template v-for="show_column of show_columns">
            <td>
              <component
                  :is="ViewData.columnsTypeHandler[show_column].td_component()"
                  :columns_key="show_column"
                  :entity="entity"
                  :handler="ViewData.columnsTypeHandler[show_column]"
              ></component>
            </td>
          </template>
        </tr>
      </template>

      </tbody>
    </q-markup-table>
  </div>
</template>

<style scoped>

</style>
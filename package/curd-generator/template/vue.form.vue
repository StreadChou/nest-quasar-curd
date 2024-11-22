<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";
import CrudComponentRemove from "nest-quasar-curd/src/frontend/view/CrudComponentRemove.vue"
import {AbstractViewData, ViewDataOption} from "nest-quasar-curd/src/frontend/view/AbstractViewData";

__IMPORT__


const $q = useQuasar();
const route = useRoute();
const router = useRouter()

interface Props {
  api: any,
  customerViewData: AbstractViewData,
  viewDataOption: ViewDataOption,
  id: string,
}
const props = defineProps<Props>();

// 编辑的ID
const id = ref<string>(props.id || route.params.id || "0");

const create_or_update = ref<"create | update">(id.value === "0" ? "create" : "update");

/** 渲染页面需要的数据定义类 */
const ViewData = ref<AbstractViewData<__CLASS_NAME__Interface>>(props.customerViewData || new __CLASS_NAME__ViewData(props.api))
if (props.viewDataOption) ViewData.value.option = props.viewDataOption;

// 表单
const entity = ref<__CLASS_NAME__Interface>({});
// 初始化的表单
const _the_init_entity = ref<__CLASS_NAME__Interface>({});
const _show_columns_ = ref(ViewData.value.getShowColumns(id.value))


// 数据是否初始化完成
const init = ref(false);

// 初始化数据
const init_data = async () => {
  const raw_entity = id.value === "0" ? undefined : (await ViewData.value.fetch_entity_one(id.value)).data;
  _the_init_entity.value = await ViewData.value.init_form_data({}, raw_entity);
  click_restore();
  init.value = true;
};


// 点击还原按钮
const click_restore = () => {
  entity.value = JSON.parse(JSON.stringify(_the_init_entity.value));
};

// 点击保存按钮
const click_save = async () => {
  const SaveAxiosResponse = await ViewData.value.save_entity(id.value, entity.value);
  ViewData.value.after_save(SaveAxiosResponse,);
};

const updateEntity = async (key: string, value: any) => {
  entity.value[key] = value;
}

// 点击删除按钮
const click_delete = async () => {
  $q.dialog({
    component: CrudComponentRemove,
    componentProps: {
      api: props.api,
      delete_id: id.value,
      restful: props.restful,
      options: _the_init_entity.value,
    }
  })
}


onMounted(() => {
  init_data().then();
})


defineExpose({updateEntity})

</script>

<template>
  <div class="full-width">
    <div class="current-row q-gutter-y-md" v-if="init">
      <template v-for="grid in ViewData.form_grids">
        <!-- 处理组合方式 -->
        <template v-if="Array.isArray(grid) && grid.some(ele=> _show_columns_.includes(ele))">
          <div class="col">
            <div class="row q-gutter-x-md">
              <template v-for="child_grid in grid" :key="child_grid">
                <div class="col" v-if="_show_columns_.includes(child_grid)">
                  <slot :name="`editor_${child_grid}`"
                        :value="entity[child_grid]"
                        :create_or_update="create_or_update"
                        :columns_key="child_grid"
                        :form="entity"
                        :handler="ViewData.columnsTypeHandler[child_grid]"
                        :update="updateEntity"
                  >
                    <component :is="ViewData.columnsTypeHandler[child_grid].form_component()"
                               v-model="entity[child_grid]"
                               :create_or_update="create_or_update"
                               :columns_key="child_grid"
                               :form="entity"
                               :handler="ViewData.columnsTypeHandler[child_grid]"
                    ></component>
                  </slot>
                </div>
              </template>
            </div>
          </div>
        </template>
        <!-- 处理单行 -->
        <template v-if="typeof grid == `string` && _show_columns_.includes(grid)">
          <div class="col">
            <div class="row q-gutter-x-md">
              <div class="col" v-if="_show_columns_.includes(grid)">
                <slot :name="`editor_${grid}`"
                      :value="entity[grid]"
                      :create_or_update="create_or_update"
                      :columns_key="grid"
                      :form="entity"
                      :handler="ViewData.columnsTypeHandler[grid]"
                      :update="updateEntity"
                >
                  <component :is="ViewData.columnsTypeHandler[grid].form_component()"
                             v-model="entity[grid]"
                             :create_or_update="create_or_update"
                             :columns_key="grid"
                             :form="entity"
                             :handler="ViewData.columnsTypeHandler[grid]"
                  ></component>
                </slot>

              </div>
            </div>
          </div>
        </template>
      </template>

    </div>
    <div class="row justify-end q-mt-md q-gutter-x-md">
      <slot name="handle_button">
        <slot name="handle_button_before"></slot>

        <q-btn color="negative" label="删除" v-if="id !== '0'" @click="click_delete"/>
        <q-btn color="warning" label="还原" @click="click_restore"/>
        <q-btn color="secondary" label="返回" @click="router.go(-1)"/>
        <q-btn color="primary" label="保存" @click="click_save"/>

        <slot name="handle_button_after"></slot>
      </slot>
    </div>
  </div>
</template>


<style scoped>

</style>

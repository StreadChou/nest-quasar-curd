<script setup lang="ts">
import {AbstractViewData, DefaultRemoveDialogVue, FormProps} from "../index";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";

type EntityType = any;

const $q = useQuasar();
const route = useRoute();
const router = useRouter()

const props = withDefaults(defineProps<FormProps>(), {})
// 数据源
const ViewData = ref<AbstractViewData<EntityType>>(props.view_data ? new props.view_data(props.api) : undefined);
// 编辑的资源ID
const id = ref<string>(props.id || route.params.id || "0");
// 是创建还是更新
const create_or_update = ref<"create | update">(id.value === "0" ? "create" : "update");
// 需要展示哪些字段
const show_columns = ref<string[]>(ViewData.value.getFormShowColumns(id.value == "0" ? null : id.value))
// 初始化的表单数据
const entity = ref<EntityType>({});
// 初始化的原始数据
const _the_init_entity = ref<EntityType>({});

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
};
// 点击删除按钮
const click_delete = async () => {
  $q.dialog({
    component: DefaultRemoveDialogVue,
    componentProps: {
      api: props.api,
      view_data: ViewData.value,
      delete_id: id.value,
      options: _the_init_entity.value,
    }
  })
}


onMounted(async () => {
  await init_data();
})

</script>

<template>
  <div class="full-width">
    <div class="current-row q-gutter-y-md" v-if="init">
      <template v-for="show_column of show_columns">
        <div class="col">
          <div class="row q-gutter-x-md">
            <div class="col">
              <component :is="ViewData.columnsTypeHandler[show_column].form_component()"
                         v-model="entity[show_column]"
                         :create_or_update="create_or_update"
                         :columns_key="show_column"
                         :form="entity"
                         :handler="ViewData.columnsTypeHandler[show_column]"
              ></component>
            </div>
          </div>
        </div>
      </template>

      <div class="col">
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
    </div>
  </div>
</template>

<style scoped>

</style>
<template>
  <q-page class="q-gutter-y-md q-pa-md">
    <div>
      <q-btn color="primary" icon="add" label="新增" to="/User/Form/0"></q-btn>
    </div>

    <DefaultHomePageVue
      :api="api"
      :view_data="UserViewData"
    ></DefaultHomePageVue>

  </q-page>
</template>

<script setup lang="ts">
import {DefaultHomePageVue} from "@stread/quasar-curd"
import {api} from "boot/axios";
import {UserViewData} from "src/nest-quasar-curd/UserViewData";

</script>

<template>
  <q-page class="q-gutter-y-md q-pa-md">
    <div>
      <q-btn color="primary" icon="add" label="列表" to="/User/Home"></q-btn>
    </div>

    <DefaultFormPageVue
      :api="api"
      :view_data="UserViewData"
    ></DefaultFormPageVue>

  </q-page>
</template>

<script setup lang="ts">
import {DefaultFormPageVue} from "@stread/quasar-curd"
import {api} from "boot/axios";
import {UserViewData} from "src/nest-quasar-curd/UserViewData";

</script>

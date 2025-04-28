<script setup lang="ts">
import ModelListItem from "components/modules/ModelListItem.vue";

const props = defineProps<{
  module: string;
}>()




</script>

<template>
  <div class="row q-col-gutter-sm">
    <div class="col-3">
      <q-btn class="full-height full-width" icon="add" label="增加Model" color="primary"
             to="/model/form/0"
      ></q-btn>
    </div>

    <template v-for="i in 10">
      <div class="col-3">
        <ModelListItem></ModelListItem>
      </div>
    </template>

  </div>
</template>

<style scoped>

</style>

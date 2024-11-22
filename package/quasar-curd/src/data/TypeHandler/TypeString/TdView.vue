<script setup lang="ts">
import {ref} from "vue";
import {HomeItemProps} from "../../../index";

const props = defineProps<HomeItemProps>();
const origin_data = ref(props.entity[props.columns_key])
</script>

<template>
  {{ origin_data }}
</template>

<style scoped>

</style>
<script setup lang="ts">
import {ref} from "vue";
import {HomeItemProps, TypeExtensionForEnum} from "../../../index";

const props = defineProps<HomeItemProps>();
const origin_data = ref(props.entity[props.columns_key])

const typeExtension = <TypeExtensionForEnum>props.handler.column.type_extension;
const string = ref(typeExtension.option[origin_data.value]?.label || "")

</script>

<template>
  {{ string }}
</template>

<style scoped>

</style>
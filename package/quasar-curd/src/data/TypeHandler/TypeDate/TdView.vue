<script setup lang="ts">
import {ref} from "vue";
import {HomeItemProps} from "../../../index";
import moment from "moment";

const props = defineProps<HomeItemProps>();
const origin_data = ref(props.entity[props.columns_key])

const string = ref("")
if (origin_data.value) {
  string.value = moment(new Date(origin_data.value)).format("YYYY-MM-DD HH:mm:ss")
}

</script>

<template>
  {{ string }}
</template>

<style scoped>

</style>
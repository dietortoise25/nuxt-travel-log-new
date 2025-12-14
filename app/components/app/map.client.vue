<script lang="ts" setup>
import { CENTER_CHINA } from "#shared/utils/constants";

const colorMode = useColorMode();

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});

const zoom = 3;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_CHINA"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>

<script lang="ts" setup>
import { CENTER_CHINA } from "#shared/utils/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});

const zoom = 3;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <div>
    <MglMap
      :map-style="style"
      :center="CENTER_CHINA"
      :zoom="zoom"
    >
      <MglNavigationControl />
      <MglMarker
        v-for="item in mapStore.mapPoints"
        :key="item.id"
        :coordinates="[item.long, item.lat]"
      >
        <template #marker>
          <div class="tooltip tooltip-top" :data-tip="item.label">
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              class="text-secondary"
            />
          </div>
        </template>
      </MglMarker>
    </MglMap>
  </div>
</template>

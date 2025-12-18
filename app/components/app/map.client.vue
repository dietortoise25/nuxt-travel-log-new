<script lang="ts" setup>
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

import { CENTER_CHINA } from "#shared/utils/constants";
import { isPointSelected } from "~~/shared/utils/map-points";

const colorMode = useColorMode();
const mapStore = useMapStore();
// const locationStore = useLocationStore();
// const { locations } = storeToRefs(locationStore);

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});

const zoom = 3;

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = location.lat;
    mapStore.addedPoint.long = location.lng;
  }
}

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
  // console.log(event.event.lngLat);
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
  }
}

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
      @map:dblclick="onDoubleClick"
    >
      <MglNavigationControl />
      <MglMarker
        v-if="mapStore.addedPoint"
        key="added-point"
        :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
        draggable
        @update:coordinates="updateAddedPoint"
      >
        <template #marker>
          <div
            class="tooltip tooltip-open tooltip-top hover:cursor-pointer z-50"
            data-tip="drag me"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              class="text-warning"
            />
          </div>
        </template>
      </MglMarker>

      <MglMarker
        v-for="item in mapStore.mapPoints"
        :key="item.id"
        :coordinates="[item.long, item.lat]"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top hover:cursor-pointer"
            :class="{
              'tooltip-open': isPointSelected(item, mapStore.selectedPoint),
            }"
            :data-tip="item.name"
            @mouseenter="mapStore.selectedPointWithoutFlyTo(item)"
            @mouseleave="mapStore.selectedPointWithoutFlyTo(null)"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              :class="{
                'text-accent': isPointSelected(item, mapStore.selectedPoint),
                'text-secondary': !isPointSelected(item, mapStore.selectedPoint),
              }"
            />
          </div>
        </template>
        <Mgl-popup>
          <h3 class="text-xl">
            {{ item.name }}
          </h3>
          <p v-if="item.description">
            {{ item.description }}
          </p>
          <div class="divider" />
          <div class="flex justify-end">
            <NuxtLink
              v-if="item.to"
              :to="item.to"
              class="btn btn-sm btn-outline"
            >
              {{ item.toLabel }}
            </NuxtLink>
          </div>
        </Mgl-popup>
      </MglMarker>
    </MglMap>
  </div>
</template>

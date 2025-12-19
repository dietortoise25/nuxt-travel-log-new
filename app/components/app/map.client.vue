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
    : "/styles/light.json";
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

      <!--  added-point marker -->
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

      <!--  map-points markers -->
      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <!-- selected styles -->
          <div
            class="tooltip tooltip-top hover:cursor-pointer"
            :class="{
              'tooltip-open': isPointSelected(point, mapStore.selectedPoint),
            }"
            :data-tip="point.name"
            @mouseenter="mapStore.selectedPoint = point"
            @mouseleave="mapStore.selectedPoint = null"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              :class="{
                'text-accent': isPointSelected(point, mapStore.selectedPoint),
                'text-secondary': !isPointSelected(point, mapStore.selectedPoint),
              }"
            />
          </div>
        </template>

        <Mgl-popup>
          <h3 class="text-xl">
            {{ point.name }}
          </h3>
          <p v-if="point.description">
            {{ point.description }}
          </p>
          <div class="divider" />
          <div class="flex justify-end">
            <NuxtLink
              v-if="point.to"
              :to="point.to"
              class="btn btn-sm btn-outline"
            >
              {{ point.toLabel }}
            </NuxtLink>
          </div>
        </Mgl-popup>
      </MglMarker>
    </MglMap>
  </div>
</template>

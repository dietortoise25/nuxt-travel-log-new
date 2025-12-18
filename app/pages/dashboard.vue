<script lang="ts" setup>
import { isPointSelected } from "~~/shared/utils/map-points";

const isSidebarOpen = ref(true);
const route = useRoute();
const sibebarStore = useSibebarStore();
const locationStore = useLocationStore();
const mapStore = useMapStore();

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  if (route.path !== "/dashboard") {
    locationStore.refresh();
  }
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value ? "true" : "false");
}
</script>

<template>
  <div class="flex-1 flex">
    <!-- side bar -->
    <div
      class="bg-base-100 transition-all duration-300 shrink-0"
      :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }"
    >
      <div
        class="flex hover:bg-base-200 hover:cursor-pointer p-2"
        :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Locations"
          icon="tabler:map"
          href="/dashboard"
        />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Add Location"
          icon="tabler:square-plus"
          href="/dashboard/add"
        />

        <div class="divider" />

        <div v-if="sibebarStore.loading" class="flex flex-col px-4 gap-2">
          <div class="skeleton h-4 w-full" />
          <div class="skeleton h-4 w-full" />
        </div>

        <div
          v-if="!sibebarStore.loading && sibebarStore.sidebarItems.length"
          class="flex flex-col"
        >
          <SidebarButton
            v-for="item in sibebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>

        <div class="divider" />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout"
          href="/sign-out"
        />
      </div>
    </div>

    <!-- main -->
    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex size-full"
        :class="{ 'flex-col': route.path !== '/dashboard/add' }"
      >
        <NuxtPage class="shrink-0" />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>

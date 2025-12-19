<script lang="ts" setup>
import { isPointSelected } from "~~/shared/utils/map-points";

const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationStore = useLocationStore();
const mapStore = useMapStore();

const { currentLocation } = storeToRefs(locationStore);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

effect(() => {
  if (route.path !== "/dashboard") {
    locationStore.refreshLocations();
  }
  if (route.path === "/dashboard") {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Locations",
        icon: "tabler:map",
        href: "/dashboard",
      },
      {
        id: "link-location-add",
        label: "Add Location",
        icon: "tabler:square-plus",
        href: "/dashboard/add",
      },
    ];
  }
  else if (route.name === "dashboard-location-slug") {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Back to Locations",
        icon: "tabler:arrow-back-up",
        href: "/dashboard",
      },
      {
        id: "link-dashboard",
        label: currentLocation.value?.name || "View Logs",
        icon: "tabler:map",
        to: {
          name: "dashboard-location-slug",
          params: {
            slug: currentLocation.value?.slug,
          },
        },
      },
      {
        id: "link-location-edit",
        label: "Edit Location",
        icon: "tabler:map-pin-cog",
        to: {
          name: "dashboard-location-slug-edit",
          params: {
            slug: currentLocation.value?.slug,
          },
        },
      },
      {
        id: "link-location-add",
        label: "Add Location Log",
        icon: "tabler:square-plus",
        to: {
          name: "dashboard-location-slug-add",
          params: {
            slug: currentLocation.value?.slug,
          },
        },
      },
    ];
  }
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug") {
    locationStore.refreshCurrentLocation();
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
      <!-- sidebar open toggle -->
      <div
        class="flex hover:bg-base-200 hover:cursor-pointer p-2"
        :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:layout-sidebar-right-expand-filled"
          size="24"
          class="transition-transform duration-300 ease-in-out"
        />
        <Icon
          v-else
          name="tabler:layout-sidebar-right-collapse-filled"
          size="24"
          class="transition-transform duration-300 ease-in-out rotate-180"
        />
      </div>

      <div class="flex flex-col">
        <!-- sidebar nav links -->
        <SidebarButton
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
          :to="item.to"
        />

        <div class="divider" />

        <!-- specific links -->
        <div v-if="sidebarStore.loading" class="flex flex-col px-4 gap-2">
          <div class="skeleton h-4 w-full" />
          <div class="skeleton h-4 w-full" />
        </div>

        <div
          v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length"
          class="flex flex-col"
        >
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
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

        <!-- sign out button -->
        <SidebarButton
          :show-label="isSidebarOpen"
          label="TEST LINK SLUG"
          icon="tabler:map"
          to="/dashboard/location/boracay"
        />
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

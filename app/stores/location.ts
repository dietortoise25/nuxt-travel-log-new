import type { SelectLocationLogWithImages, SelectLocationWithLogs } from "~~/server/db/schema";

import {
  CURRENT_LOCATION_PAGES,
  LOCATION_PAGES,
} from "#shared/utils/constants";

export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();

  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations,
  } = useFetch("/api/locations", {
    lazy: true,
  });

  const locationUrlWithSlug = computed(() => {
    return `/api/locations/${route.params.slug}`;
  });
  const locationLogUrlWithSlugAndId = computed(() => `/api/locations/${route.params.slug}/${route.params.id}`);

  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
  } = useFetch<SelectLocationLogWithImages>(locationLogUrlWithSlugAndId, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    // 如果在["dashboard", "dashboard-add"]，初始化mapPoints / sidebarItems, 根据locations生成新mapPoints / sidebaritems
    if (locations.value && LOCATION_PAGES.has(route.name?.toString() || "")) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: "tabler:map-pin-filled",
          to: { name: "dashboard-location-slug", params: { slug: location.slug } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    // 如果在["dashboard-location-slug","dashboard-location-slug-edit","dashboard-location-slug-add",]，
    // 初始化mapPoints / sidebarItems, 根据 currentLocation的logs 生成新mapPoints / sidebaritems
    else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      currentLocation.value.locationLogs.forEach((log) => {
        const mapPoint = createMapPointFromLocationLog(log);
        sidebarItems.push({
          id: `location-log-${log.id}`,
          label: log.name,
          icon: "tabler:map-pin-filled",
          to: { name: "dashboard-location-slug-id", params: { id: log.id } },
          mapPoint,
        });
        mapPoints.push(mapPoint);

        sidebarStore.sidebarItems = sidebarItems;
        if (mapPoints.length) {
          mapStore.mapPoints = mapPoints;
        }
        else {
          if (currentLocation.value) {
            mapStore.mapPoints = [currentLocation.value];
          }
        }
      });
    }

    sidebarStore.loading = locationsStatus.value === "pending";
  });

  // 监听路由参数变化
  watch(
    () => route.params.slug,
    (newSlug) => {
      if (newSlug && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
      // 只有当slug存在且在相关页面时才刷新数据
        nextTick(() => {
          refreshCurrentLocation();
        });
      }
    },
    { immediate: true }, // 立即执行一次，处理首次进入的情况
  );

  return {
    locations,
    locationsStatus,
    refreshLocations,
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,
    currentLocationLog,
    currentLocationLogStatus,
    currentLocationLogError,
    refreshCurrentLocationLog,
  };
});

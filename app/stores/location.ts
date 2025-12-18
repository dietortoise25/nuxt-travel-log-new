export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });

  const sibebarStore = useSibebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      data.value.forEach((location) => {
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

      sibebarStore.loading = false;
      sibebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    else {
      sibebarStore.loading = status.value === "pending";
    }
  });

  return {
    locations: data,
    status,
    refresh,
  };
});

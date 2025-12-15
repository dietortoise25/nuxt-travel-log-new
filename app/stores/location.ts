export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });

  const sibebarStore = useSibebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      sibebarStore.loading = false;
      sibebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        href: "#",
        location,
      }));
      mapStore.mapPoints = data.value.map(location => ({
        id: location.id,
        name: location.name,
        lat: location.lat,
        long: location.long,
        description: location.description,
      }));
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

import type { LngLatBounds } from "maplibre-gl";

export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapPoint = {
  id: number;
  name: string;
  description: string | null;
} & LatLongItem;

let bounds: LngLatBounds | null = null;
const padding: number = 80;

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint | null>(null);

  const shouldFlyTo = ref(true);

  function selectedPointWithoutFlyTo(point: MapPoint | null) {
    shouldFlyTo.value = false;
    selectedPoint.value = point;
  }

  async function init() {
    const { useMap } = await import ("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import ("maplibre-gl");

    const map = useMap();

    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint)
        return;
      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat]));

      map.map?.fitBounds(bounds, {
        padding,
      });
    });

    effect(() => {
      if (addedPoint.value)
        return;
      if (selectedPoint.value) {
        if (shouldFlyTo.value) {
          map.map?.flyTo({
            center: [selectedPoint.value.long, selectedPoint.value.lat],
            // zoom: 6,
            speed: 1,
            // curve: 1,
            // easing(t) {
            //   return t;
            // },
          });
        }
        shouldFlyTo.value = true;
      }
      else if (bounds) {
        map.map?.fitBounds(bounds, {
          padding,
        });
      }
    });

    watch(addedPoint, (newValue, oldValue) => {
      if (newValue && !oldValue) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          zoom: 6,
          speed: 1,
        });
      }
    }, {
      immediate: true,
    });
  }

  return {
    mapPoints,
    selectedPoint,
    addedPoint,
    init,
    selectedPointWithoutFlyTo,
  };
});

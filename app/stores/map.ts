import type { LngLatBounds } from "maplibre-gl";

// import type { MapPoint } from "~/lib/types";
import { CENTER_CHINA } from "#shared/utils/constants";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint & { centerMap?: boolean } | null>(null);

  async function init() {
    const { useMap } = await import ("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import ("maplibre-gl");

    const map = useMap();

    let bounds: LngLatBounds | null = null;
    const padding: number = 80;

    // 监听mapPoints数组
    effect(() => {
      const firstPoint = mapPoints.value[0];

      // 如果没有第一个值，飞去默认中心点
      if (!firstPoint) {
        map.map?.flyTo({
          center: CENTER_CHINA,
          zoom: 2,
        });
        return;
      }

      // 如果有值，设定地图边界bounds:LngLatBounds
      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      ));

      // 然后fitBounds
      map.map?.fitBounds(bounds, {
        padding,
        maxZoom: 10,
      });
    });

    watch(addedPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
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
    // selectedPointWithoutFlyTo,
  };
});

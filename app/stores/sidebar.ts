import type { SidebarItem } from "~~/shared/utils/types";

export const useSibebarStore = defineStore("useSibebarStore", () => {
  const sidebarItems = ref<SidebarItem[]>([]);
  const loading = ref(false);
  return {
    sidebarItems,
    loading,
  };
});

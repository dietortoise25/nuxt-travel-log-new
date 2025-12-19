import type { SidebarItem } from "~~/shared/utils/types";

export const useSidebarStore = defineStore("useSidebarStore", () => {
  const sidebarItems = ref<SidebarItem[]>([]);
  const sidebarTopItems = ref<SidebarItem[]>([]);
  const loading = ref(false);

  return {
    sidebarItems,
    sidebarTopItems,
    loading,
  };
});

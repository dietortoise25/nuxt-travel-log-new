export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  location: MapPoint | null;
};

export const useSibebarStore = defineStore("useSibebarStore", () => {
  const sidebarItems = ref<SidebarItem[]>([]);
  const loading = ref(false);
  return {
    sidebarItems,
    loading,
  };
});

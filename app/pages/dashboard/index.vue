<script lang="ts" setup>
const isSidebarOpen = ref(true);

onMounted(() => {
  const storedState = localStorage.getItem("isSidebarOpen");
  if (storedState !== null) {
    isSidebarOpen.value = storedState === "true";
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
      class="bg-base-100 transition-all duration-300"
      :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }"
    >
      <div
        class="flex hover:bg-base-200 hover:cursor-pointer p-2"
        :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="32" />
        <Icon v-else name="tabler:chevron-right" size="32" />
      </div>
      <div class="flex flex-col">
        <SidebarButton :show-label="isSidebarOpen" label="Locations" icon="tabler:map" href="/dashboard" />
        <SidebarButton :show-label="isSidebarOpen" label="Add Location" icon="tabler:square-plus" href="/dashboard/add" />

        <div class="divider" />
        <SidebarButton :show-label="isSidebarOpen" label="Sign Out" icon="tabler:logout" href="sign-out" />
      </div>
    </div>

    <!-- main -->
    <div class="flex-1">
      main
    </div>
  </div>
</template>

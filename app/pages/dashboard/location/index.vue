<!-- index.vue -->
<script setup lang='ts'>
const locationStore = useLocationStore();
onMounted(() => {
  // console.log("locationUrlWithSlug:", locationUrlWithSlug);
  locationStore.refreshCurrentLocation();
});
</script>

<template>
  <div>
    /dashboard/location/index
  </div>
</template>

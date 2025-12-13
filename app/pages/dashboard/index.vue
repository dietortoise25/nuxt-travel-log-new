<script lang="ts" setup>
const { data, status } = await useFetch("/api/locations", {
  lazy: true,
});

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center mb-6">
      <h2 class="text-2xl font-bold">
        My Locations
      </h2>
    </div>

    <!-- Loading state -->
    <div v-if="status === 'pending'" class="flex justify-center">
      <span class="loading loading-spinner loading-lg" />
    </div>

    <!-- Error state -->
    <div v-else-if="status === 'error'" class="alert alert-error">
      <Icon name="tabler:alert-triangle" size="24" />
      <span>Failed to load locations. Please try again.</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="!data || data.length === 0" class="hero bg-base-200 rounded-lg p-12">
      <div class="hero-content text-center">
        <div>
          <Icon name="tabler:map-pin" size="48" class="mb-4 mx-auto text-base-content/60" />
          <h3 class="text-xl font-semibold mb-2">
            No locations yet
          </h3>
          <p class="text-base-content/70 mb-4">
            Start tracking your travel destinations by adding your first location.
          </p>
          <NuxtLink to="/dashboard/add" class="btn btn-primary">
            <Icon name="tabler:plus" size="20" />
            Add Your First Location
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Locations cards -->
    <div v-else class="flex flex-wrap mt-4 gap-2">
      <div
        v-for="location in data"
        :key="location.id"
        class="card bg-base-300 h-40 w-72 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="card-body">
          <div class="flex items-start justify-between mb-2">
            <h3 class="card-title text-lg">
              <Icon name="tabler:map-pin" size="24" class="text-primary" />
              {{ location.name }}
            </h3>
          </div>

          <p v-if="location.description" class="text-base-content/70 mb-4 line-clamp-2">
            {{ location.description }}
          </p>
        </div>
        <!-- Created date -->
        <div class="card-actions justify-end text-xs text-base-content/50 p-4 pt-0">
          <span class="flex items-center gap-1">
            <Icon name="tabler:calendar" size="14" />
            Created {{ formatDate(location.createdAt) }}
          </span>
        </div>

        <!-- Card actions -->
        <!-- <div class=" justify-end ">
          <button class="btn btn-ghost btn-sm" @click="navigateTo(`/dashboard/locations/${location.slug}`)">
            <Icon name="tabler:eye" size="16" />
            View
          </button>
          <button class="btn btn-ghost btn-sm" @click="navigateTo(`/dashboard/locations/${location.slug}/edit`)">
            <Icon name="tabler:edit" size="16" />
            Edit
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

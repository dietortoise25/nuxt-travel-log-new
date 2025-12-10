<script lang="ts" setup>
const route = useRoute();
const error = route.query.error || "An unknow error occurred.";
</script>

<template>
  <div class="card bg-base-300 container mt-4 min-h-72 text-center mx-auto flex flex-col justify-center gap-4">
    <div class="card-body">
      <div role="alert" class="alert alert-error justify-center">
        <span>Oh no! {{ error }}</span>
      </div>

      <div class="justify-center card-actions">
        <NuxtLink to="/" class="btn btn-primary">
          Go Home
          <Icon name="tabler:home" size="24" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

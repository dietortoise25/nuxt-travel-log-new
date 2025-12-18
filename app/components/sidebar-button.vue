<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  showLabel: boolean;
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  iconColor?: "text-accent" | "text-primary" | "text-secondary";
}>();
const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right">
    <div v-if="!showLabel" class="tooltip-content">
      <div class="animate-bounce text-orange-400  font-black">
        {{ props.label }}
      </div>
    </div>
    <NuxtLink
      :to="props.href || props.to"
      class="flex gap-2 p-2 hover:bg-base-300 hover:cursor-pointer flex-nowrap"
      :class="{ 'bg-base-200': route.path === props.href, 'justify-center': !showLabel, 'justify-start': showLabel }"
    >
      <Icon
        :name="props.icon"
        size="24"
        :class="iconColor"
      />
      <Transition name="grow">
        <span v-if="showLabel">
          {{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.1s;
}
.grow-leave-active {
  animation: grow 0.1s reverse;
}
@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>

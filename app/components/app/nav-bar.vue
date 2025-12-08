<template>
  <div class="navbar bg-primary text-primary-content">
    <div className="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl">
        Travel Log
      </NuxtLink>
    </div>
    <div className="navbar-end space-x-2">
      <AppThemeToggle />
      <NuxtLink class="btn btn-accent">
        Sign In<Icon name="tabler:brand-github" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>

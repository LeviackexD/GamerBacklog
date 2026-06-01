<script setup>
const route = useRoute()
const defaultTitle = 'Gamer Backlog'

useHead(() => ({
  title: route.meta.title
    ? `${route.meta.title} · ${defaultTitle}`
    : defaultTitle,
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

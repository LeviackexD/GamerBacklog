<script setup>
import { ref } from 'vue'

const videoRef = ref(null)
</script>

<template>
  <div class="fixed inset-0 w-full h-full overflow-hidden" style="z-index: 0;">
    <video
      ref="videoRef"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/videos/Gameplay.mp4" type="video/mp4">
    </video>
    <div class="absolute inset-0 bg-gradient-to-b from-[#1a1a3e]/75 via-[#1a1a3e]/60 to-[#1a1a3e]/85" />
  </div>
</template>

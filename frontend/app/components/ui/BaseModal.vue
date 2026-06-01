<script setup>
defineProps({
  show: Boolean,
  title: String,
})

defineEmits(['close'])
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <div class="fixed inset-0 bg-retro-black/80 backdrop-blur-sm" />
      <div class="relative bg-retro-dark border-2 border-retro-border p-6 shadow-pixel max-w-md w-full">
        <h2 v-if="title" class="font-pixel text-xs text-retro-cyan mb-4">
          {{ title }}
        </h2>
        <slot />
      </div>
    </div>
  </Transition>
</template>

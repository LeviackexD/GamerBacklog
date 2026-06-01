<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'danger', 'ghost', 'success'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v),
  },
})

const variantClasses = {
  primary: 'bg-retro-cyan text-retro-black border-retro-cyan hover:shadow-glow-cyan',
  danger: 'bg-retro-red text-retro-black border-retro-red hover:shadow-glow-red',
  ghost: 'bg-transparent text-retro-cyan border-2 border-retro-cyan hover:bg-retro-cyan/10',
  success: 'bg-retro-green text-retro-black border-retro-green hover:shadow-glow-green',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
}
</script>

<template>
  <button
    type="button"
    class="btn-retro inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed
           disabled:hover:shadow-none disabled:border-b-2 relative overflow-hidden group/btn"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <span class="relative z-10"><slot /></span>
    <span
      class="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"
      :class="variant === 'ghost' ? 'bg-retro-cyan/10' : 'bg-white/10'"
    />
    <span
      class="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"
      :class="variant === 'ghost' ? 'bg-retro-cyan/50' : 'bg-white/30'"
    />
  </button>
</template>

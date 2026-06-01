<script setup>
const { user, isAuthenticated, logout, checkAuth } = useAuth()
const poweredOn = ref(false)
const menuOpen = ref(false)

onMounted(() => {
  checkAuth()
  setTimeout(() => { poweredOn.value = true }, 100)
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-retro-black">
    <!-- Scanlines overlay -->
    <div class="fixed inset-0 pointer-events-none z-40"
      style="background: repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px);"
    />
    <!-- CRT vignette -->
    <div class="fixed inset-0 pointer-events-none z-40"
      style="background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%);"
    />

    <div class="crt-flicker flex flex-col flex-1 relative z-10">
      <div :class="['flex flex-col flex-1 relative', { 'crt-power-on': !poweredOn }]">
        <!-- Gradient overlay for readability -->
        <div class="fixed inset-0 z-[1] pointer-events-none"
          style="background: linear-gradient(180deg, rgba(26,26,62,0.3) 0%, rgba(26,26,62,0.05) 50%, rgba(26,26,62,0.4) 100%);"
        />

        <!-- Header -->
        <header class="flex-shrink-0 relative z-30 border-b-2 border-retro-border/50 bg-retro-dark/95 backdrop-blur-lg shadow-[0_0_20px_rgba(72,219,251,0.08)]">
          <div class="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <NuxtLink to="/" class="flex items-center gap-2 sm:gap-3 group" @click="closeMenu">
              <div class="flex items-center gap-1 font-pixel text-sm sm:text-base">
                <span class="text-retro-cyan text-glow-cyan group-hover:animate-pixelBounce transition-all duration-300">&lt;</span>
                 <span class="text-retro-yellow text-glow-yellow relative">
                    GB
                    <span class="absolute -inset-2 bg-retro-yellow/10 blur-md" />
                  </span>
                <span class="text-retro-cyan text-glow-cyan group-hover:animate-pixelBounce transition-all duration-300" style="animation-delay: 0.1s">/&gt;</span>
              </div>
              <span class="font-pixel text-[10px] sm:text-xs text-retro-cyan/80 text-glow-cyan hidden sm:inline tracking-[0.2em]">
                BACKLOG
              </span>
            </NuxtLink>

            <!-- Desktop nav -->
            <nav class="hidden sm:flex items-center gap-3 sm:gap-5">
              <template v-if="isAuthenticated">
                <NuxtLink
                  to="/juegos"
                  class="font-pixel text-[10px] sm:text-xs text-retro-cyan text-glow-cyan hover:brightness-150 transition-all duration-200"
                >
                  JUEGOS
                </NuxtLink>

                <NuxtLink
                  to="/juegos/nuevo"
                  class="font-pixel text-[10px] sm:text-xs bg-retro-red text-retro-black px-3 py-2 sm:px-4 sm:py-2.5
                         shadow-glow-red hover:brightness-110 transition-all duration-200 relative overflow-hidden group"
                >
                  <span class="relative z-10">+ NUEVO</span>
                  <span class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                </NuxtLink>

                <NuxtLink
                  to="/perfil"
                  class="font-pixel text-[9px] sm:text-[10px] text-retro-cyan text-glow-cyan transition-all duration-200"
                  :title="user?.alias"
                >
                  {{ user?.alias?.toUpperCase() }}
                </NuxtLink>

                <button
                  class="font-pixel text-[9px] sm:text-[10px] text-retro-red/70 hover:text-retro-red transition-all duration-200"
                  @click="logout"
                >
                  SALIR
                </button>
              </template>

              <template v-else>
                <NuxtLink
                  to="/login"
                  class="font-pixel text-[10px] sm:text-xs text-retro-cyan text-glow-cyan hover:brightness-150 transition-all duration-200"
                >
                  ENTRAR
                </NuxtLink>

                <NuxtLink
                  to="/registro"
                  class="btn-retro bg-retro-cyan text-retro-black shadow-glow-cyan border-b-4 border-cyan-700"
                >
                  REGISTRO
                </NuxtLink>
              </template>
            </nav>

            <!-- Hamburger button (mobile) -->
            <button
              class="sm:hidden p-3 text-retro-mute hover:text-retro-cyan transition-colors duration-200"
              @click="toggleMenu"
              aria-label="Menú de navegación"
              :aria-expanded="menuOpen"
            >
              <div class="w-5 h-4 relative flex flex-col justify-between">
                <span class="block h-0.5 bg-current rounded transition-all duration-200"
                  :class="{ 'rotate-45 translate-y-[7px]': menuOpen }" />
                <span class="block h-0.5 bg-current rounded transition-all duration-200"
                  :class="{ 'opacity-0': menuOpen }" />
                <span class="block h-0.5 bg-current rounded transition-all duration-200"
                  :class="{ '-rotate-45 -translate-y-[7px]': menuOpen }" />
              </div>
            </button>
          </div>

          <!-- Mobile dropdown menu -->
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <div
              v-if="menuOpen"
              class="sm:hidden border-t-2 border-retro-border bg-retro-dark/95 backdrop-blur-sm"
            >
              <div class="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
                <template v-if="isAuthenticated">
                  <NuxtLink
                    to="/juegos"
                    class="font-pixel text-[10px] text-retro-cyan/70 hover:text-retro-cyan transition-all duration-200 px-3 py-3 border border-retro-cyan/30 hover:border-retro-cyan"
                    @click="closeMenu"
                  >
                    [ MIS JUEGOS ]
                  </NuxtLink>
                  <NuxtLink
                    to="/juegos/nuevo"
                    class="font-pixel text-[10px] text-retro-black bg-retro-red px-3 py-3 border border-retro-red text-center
                           shadow-glow-red hover:brightness-110 transition-all duration-200"
                    @click="closeMenu"
                  >
                    + NUEVO JUEGO
                  </NuxtLink>
                  <NuxtLink
                    to="/perfil"
                    class="font-pixel text-[10px] text-retro-cyan text-glow-cyan transition-all duration-200 px-3 py-3 border border-retro-cyan/30 hover:border-retro-cyan"
                    @click="closeMenu"
                  >
                    {{ user?.alias?.toUpperCase() || '[ PERFIL ]' }}
                  </NuxtLink>
                  <button
                    class="font-pixel text-[10px] text-retro-red/70 hover:text-retro-red transition-all duration-200 px-3 py-3 border border-retro-red/30 hover:border-retro-red text-left"
                    @click="logout"
                  >
                    [ CERRAR SESIÓN ]
                  </button>
                </template>

                <template v-else>
                  <NuxtLink
                    to="/login"
                    class="font-pixel text-[10px] text-retro-cyan text-glow-cyan hover:brightness-150 transition-all duration-200 px-3 py-3 border border-retro-cyan/30"
                    @click="closeMenu"
                  >
                    ENTRAR
                  </NuxtLink>
                  <NuxtLink
                    to="/registro"
                    class="btn-retro bg-retro-cyan text-retro-black shadow-glow-cyan border-b-4 border-cyan-700 text-center"
                    @click="closeMenu"
                  >
                    REGISTRO
                  </NuxtLink>
                </template>
              </div>
            </div>
          </transition>
        </header>

        <!-- Main content -->
        <main class="flex-1 relative z-20 max-w-6xl mx-auto w-full px-4 py-6 sm:py-8">
          <div class="relative">
            <slot />
          </div>
        </main>

        <!-- Footer -->
        <footer class="flex-shrink-0 relative z-30 border-t-2 border-retro-border/50 bg-retro-dark/95 backdrop-blur-lg">
          <div class="max-w-6xl mx-auto px-4 py-4 sm:py-5">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p class="font-body text-base sm:text-lg text-retro-mute">
                &copy; 2026 <span class="text-retro-cyan">Gamer Backlog</span>
              </p>
              <p class="font-body text-base sm:text-lg text-retro-mute text-center flex items-center gap-2">
                <span class="inline-block w-1.5 h-1.5 bg-retro-yellow rotate-45" />
                "Porque ya va siendo hora de terminar algo en tu vida gamer."
                <span class="inline-block w-1.5 h-1.5 bg-retro-yellow rotate-45" />
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

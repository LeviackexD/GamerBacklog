<script setup>
import { useIntersectionObserver } from '@vueuse/core'

definePageMeta({ title: 'Inicio' })

const { isAuthenticated } = useAuth()
const juegosLink = computed(() => isAuthenticated.value ? '/juegos' : '/login')
const nuevoLink = computed(() => isAuthenticated.value ? '/juegos/nuevo' : '/login')

const gbaSection = ref(null)
const gbaVisible = ref(false)

const { stop } = useIntersectionObserver(
  gbaSection,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      gbaVisible.value = true
      stop()
    }
  },
  { threshold: 0.15 }
)
</script>

<template>
  <div>
    <RetroBackground v-if="!isAuthenticated" />
    <div class="animate-fade-in">
    <!-- Hero Section - full viewport -->
    <section class="relative min-h-[90vh] flex flex-col items-center justify-center py-12 sm:py-20 overflow-hidden">
      <!-- Top/Bottom gradient lines -->
      <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-retro-cyan to-transparent opacity-40 animate-neon-pulse" />
      <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-retro-cyan to-transparent opacity-40 animate-neon-pulse" />

      <div class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 flex-1 w-full">
        <!-- Avatar - bigger -->
        <div class="relative shrink-0 animate-scale-in group">
          <img
            src="/avatar.png"
            alt="Avatar"
            class="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain
              animate-avatar-idle
              drop-shadow-[0_0_15px_rgba(72,219,251,0.3)]
              group-hover:drop-shadow-[0_0_30px_rgba(72,219,251,0.6)]
              transition-all duration-700"
          />
        </div>

        <!-- Hero Content -->
        <div class="text-center lg:text-left max-w-2xl animate-slide-in-up">
          <!-- Glitch Title -->
          <div class="font-pixel text-5xl sm:text-7xl lg:text-8xl text-retro-cyan mb-4 text-glow-cyan tracking-wider glitch" data-text="<GB/>"
            style="text-shadow:0 0 20px rgba(72,219,251,0.6),0 0 40px rgba(72,219,251,0.3),0 0 80px rgba(72,219,251,0.15)">
            &lt;GB/&gt;
          </div>

          <h1 class="font-pixel text-2xl sm:text-4xl text-retro-text mt-6 leading-relaxed animate-slide-in-up" style="animation-delay: 0.2s">
            GAMER<br class="sm:hidden" />
            <span class="text-retro-yellow text-glow-yellow" style="text-shadow:0 0 15px rgba(254,202,87,0.5),0 0 30px rgba(254,202,87,0.2)">BACKLOG</span>
          </h1>

          <p class="font-body text-2xl sm:text-3xl text-retro-mute mt-4 animate-slide-in-up" style="animation-delay: 0.3s">
            Porque ya va siendo hora de terminar algo en tu vida gamer.
          </p>

          <div class="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-slide-in-up" style="animation-delay: 0.4s">
            <NuxtLink
              :to="juegosLink"
              class="btn-retro bg-retro-cyan text-retro-black shadow-glow-cyan border-b-4 border-cyan-700 w-full sm:w-auto text-center"
            >
              VER MIS JUEGOS
            </NuxtLink>
            <NuxtLink
              :to="nuevoLink"
              class="btn-retro bg-retro-dark/80 border-2 border-retro-cyan text-retro-cyan
                     hover:bg-retro-cyan/20 shadow-[0_0_10px_rgba(72,219,251,0.2)] border-b-4 w-full sm:w-auto text-center"
            >
              {{ isAuthenticated ? '+ AÑADIR JUEGO' : 'EMPEZAR' }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-retro-cyan/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <div class="pixel-divider" />

    <!-- Live Dashboard Preview - scroll reveal -->
    <section ref="gbaSection" class="py-10 sm:py-16">
      <h2 class="font-pixel text-xs sm:text-sm text-retro-cyan text-center mb-2 uppercase tracking-widest text-glow-cyan"
        :class="[gbaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4']"
        style="will-change:transform,opacity; transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s,transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s">
        Tu backlog en vivo
      </h2>
      <p class="font-body text-lg text-retro-mute text-center mb-10 sm:mb-14"
        :class="[gbaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4']"
        style="will-change:transform,opacity; transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s,transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s">
        Así se ve tu próxima sesión.
      </p>

      <div class="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16"
        :class="[gbaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12']"
        style="will-change:transform,opacity; transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s,transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s">
        <!-- GBA SP Console -->
        <div class="relative shrink-0"
          :class="[gbaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95']"
          style="will-change:transform,opacity; transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s,transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s">
          <div class="relative bg-gradient-to-b from-[#6b5ce7] to-[#4a3db8] rounded-2xl p-6 sm:p-8 lg:p-10
            shadow-[0_0_30px_rgba(72,219,251,0.15),inset_0_0_20px_rgba(255,255,255,0.08)]
            border-2 border-[#8b7ff0]/40 w-full max-w-[420px] lg:max-w-[480px]"
            style="transform:translateZ(0)">

            <!-- Screen Area (GB Color style frame) -->
            <div class="relative"
              style="background:#23252d; border-radius:15px 15px 15px 15px; padding:35px 40px 5px 40px; color:#67879a; box-shadow:0 2px 0 #000, 0 -2px 0 #000, -2px 0 0 #000, 2px 0 0 #000">
              
              <!-- Power LED -->
              <div class="absolute" style="left:0; top:80px; width:50px; font-size:10px; letter-spacing:-0.5px; text-align:center">
                <div style="line-height:14px">
                  <span style="display:inline-block; background:#ca1a21; width:8px; height:8px; border-radius:50%; box-shadow:0 0 10px #ff552e; position:relative; z-index:5"></span>
                </div>
                POWER
              </div>

              <!-- Display - our backlog content -->
              <div class="rounded-sm mb-4 sm:mb-5 p-4 sm:p-5 lg:p-6"
                style="background:#929d97; box-shadow:inset 2px 2px 3px rgba(0,0,0,0.15)">

                <div class="font-pixel text-[7px] sm:text-[9px] lg:text-[10px] text-[#2d3533] space-y-3 sm:space-y-4 leading-relaxed">
                  <!-- Header -->
                  <div class="flex justify-between items-center pb-2 sm:pb-3 border-b border-[#2d3533]/20">
                    <span class="tracking-widest font-bold">BACKLOG</span>
                    <span class="text-[#2d3533]/50">3 títulos</span>
                  </div>

                  <!-- Entry 1 -->
                  <div class="group/screen-entry hover:bg-[#2d3533]/10 -mx-2 sm:-mx-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded cursor-pointer">
                    <div class="flex justify-between items-center">
                      <span class="truncate font-medium">THE LEGEND OF ZELDA: BOTW</span>
                      <span class="text-[#2d3533]/60 shrink-0 ml-2">45h</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1 sm:mt-1.5">
                      <div class="flex-1 h-1.5 sm:h-2 bg-[#2d3533]/15 rounded-sm">
                        <div class="h-full w-[80%] bg-[#2d3533] rounded-sm" style="transition: width 0.5s ease" />
                      </div>
                      <span class="text-[#2d3533]/60 text-[6px] sm:text-[7px]">80%</span>
                    </div>
                  </div>

                  <!-- Entry 2 -->
                  <div class="group/screen-entry hover:bg-[#2d3533]/10 -mx-2 sm:-mx-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded cursor-pointer">
                    <div class="flex justify-between items-center">
                      <span class="truncate font-medium">ELDEN RING</span>
                      <span class="text-[#2d3533]/60 shrink-0 ml-2">30h</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1 sm:mt-1.5">
                      <div class="flex-1 h-1.5 sm:h-2 bg-[#2d3533]/15 rounded-sm">
                        <div class="h-full w-[60%] bg-[#2d3533] rounded-sm" style="transition: width 0.5s ease" />
                      </div>
                      <span class="text-[#2d3533]/60 text-[6px] sm:text-[7px]">60%</span>
                    </div>
                  </div>

                  <!-- Entry 3 -->
                  <div class="group/screen-entry hover:bg-[#2d3533]/10 -mx-2 sm:-mx-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded cursor-pointer">
                    <div class="flex justify-between items-center">
                      <span class="truncate font-medium">CELESTE</span>
                      <span class="text-[#2d3533]/60 shrink-0 ml-2">10h</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1 sm:mt-1.5">
                      <div class="flex-1 h-1.5 sm:h-2 bg-[#2d3533]/15 rounded-sm">
                        <div class="h-full w-full bg-[#2d3533] rounded-sm" />
                      </div>
                      <span class="text-[#2d3533]/60 text-[6px] sm:text-[7px]">100%</span>
                    </div>
                  </div>

                  <!-- Add button -->
                  <div class="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-[#2d3533]/20">
                    <div class="text-center text-[#2d3533]/60 group/add cursor-pointer">
                      <span class="group-hover/add:text-[#2d3533] transition-colors duration-200">[ + AÑADIR JUEGO ]</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- GAME BOY COLOR label -->
              <div class="relative text-center" style="z-index:5">
                <span style="font-weight:bold; font-style:italic; font-size:18px; color:#67879a">GAME BOY</span>
                <span style="font-family:'Comic Sans MS'; font-weight:bold; font-size:20px; letter-spacing:-1px">
                  <span style="color:#aa2058; display:inline-block">C</span>
                  <span style="color:#605bd9; font-size:18px; display:inline-block">O</span>
                  <span style="color:#78b930; display:inline-block; transform:rotateZ(-10deg)">L</span>
                  <span style="color:#b6b524; font-size:18px; display:inline-block">O</span>
                  <span style="color:#317aaf; display:inline-block">R</span>
                </span>
              </div>
            </div>

            <!-- Nintendo badge -->
            <div class="mx-auto mt-5 text-center"
              style="width:85px; color:#3436bf; font-weight:bold; font-size:13px; border:2px solid #3436bf; border-radius:11px; padding:2px 0; text-shadow:0 -2px 1px #6b67ed; box-shadow:0 -2px 1px #6b67ed">
              Nintendo
            </div>

            <!-- Controls: D-Pad + A/B -->
            <div class="flex justify-between items-center mt-5 px-1">
              <!-- D-Pad -->
              <div class="dpad relative" style="width:90px; height:90px">
                <div class="dpad-btn" style="top:4px; left:33%; width:33%; height:33%; border-top:4px solid #000; border-left:4px solid #000; border-right:4px solid #000; border-radius:5px 5px 0 0">
                  <svg class="w-full h-full" style="color:#333a4a; text-shadow:0 -0.5px 0 #aaa" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5l-7 7h14l-7-7z"/></svg>
                </div>
                <div class="dpad-btn" style="top:33%; left:calc(66% - 4px); width:33%; height:33%; border-top:4px solid #000; border-bottom:4px solid #000; border-right:4px solid #000; border-radius:0 5px 5px 0">
                  <svg class="w-full h-full" style="color:#333a4a; text-shadow:0 -0.5px 0 #aaa" viewBox="0 0 24 24" fill="currentColor"><path d="M19 12l-7-7v14l7-7z"/></svg>
                </div>
                <div class="dpad-btn" style="top:calc(66% - 4px); left:33%; width:33%; height:33%; border-left:4px solid #000; border-bottom:4px solid #000; border-right:4px solid #000; border-radius:0 0 5px 5px">
                  <svg class="w-full h-full" style="color:#333a4a" viewBox="0 0 24 24" fill="currentColor"><path d="M12 19l7-7H5l7 7z"/></svg>
                </div>
                <div class="dpad-btn" style="top:33%; left:4px; width:33%; height:33%; border-top:4px solid #000; border-bottom:4px solid #000; border-left:4px solid #000; border-radius:5px 0 0 5px">
                  <svg class="w-full h-full" style="color:#333a4a; text-shadow:0 -0.5px 0 #aaa" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12l7 7V5l-7 7z"/></svg>
                </div>
                <div class="absolute rounded-full" style="top:33%; left:33%; width:33%; height:33%; z-index:5; background:linear-gradient(to bottom,#6d7075 0%,#6d7075 30%,#23272f 70%,#23272f 100%); border:1px solid #6e737a"></div>
              </div>

              <!-- A/B Buttons -->
              <div class="relative flex items-end gap-3 sm:gap-4" style="transform:rotate(-25deg)">
                <div class="ab-btn" style="font-size:20px; width:40px; height:40px; line-height:40px; border-radius:50%; background:#2c313e; border-bottom:2px solid #888; box-shadow:-1px 1px 5px #000, inset 0 0 5px #000; text-shadow:0 -1px 1px #888; color:#2c313e; text-align:center; cursor:pointer; -webkit-user-select:none; user-select:none">
                  B
                </div>
                <div class="ab-btn" style="font-size:22px; width:45px; height:45px; line-height:45px; border-radius:50%; background:#2c313e; border-bottom:2px solid #888; box-shadow:-1px 1px 5px #000, inset 0 0 5px #000; text-shadow:0 -1px 1px #888; color:#2c313e; text-align:center; cursor:pointer; -webkit-user-select:none; user-select:none">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature Callouts -->
        <div class="space-y-8 lg:space-y-10">
          <div class="group/callout"
            :class="[gbaVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8']"
            style="will-change:transform,opacity; transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s,transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s">
            <div class="flex items-start gap-4">
              <div class="w-3 h-3 rounded-full bg-retro-cyan shadow-glow-cyan animate-pulse-glow shrink-0 mt-1" />
              <div>
                <h3 class="font-pixel text-[9px] sm:text-xs text-retro-cyan text-glow-cyan tracking-wider uppercase">
                  Añade
                </h3>
                <p class="font-body text-lg sm:text-xl text-retro-mute mt-1 leading-relaxed">
                  Juegos a tu arsenal. Cada título cuenta.
                </p>
              </div>
            </div>
          </div>

          <div class="group/callout"
            :class="[gbaVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8']"
            style="will-change:transform,opacity; transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.45s,transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.45s">
            <div class="flex items-start gap-4">
              <div class="w-3 h-3 rounded-full bg-retro-cyan shadow-glow-cyan animate-pulse-glow shrink-0 mt-1" />
              <div>
                <h3 class="font-pixel text-[9px] sm:text-xs text-retro-cyan text-glow-cyan tracking-wider uppercase">
                  Prioriza
                </h3>
                <p class="font-body text-lg sm:text-xl text-retro-mute mt-1 leading-relaxed">
                  Algoritmo inteligente. Siguiente juego siempre claro.
                </p>
              </div>
            </div>
          </div>

          <div class="group/callout"
            :class="[gbaVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8']"
            style="will-change:transform,opacity; transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s,transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s">
            <div class="flex items-start gap-4">
              <div class="w-3 h-3 rounded-full bg-retro-cyan shadow-glow-cyan animate-pulse-glow shrink-0 mt-1" />
              <div>
                <h3 class="font-pixel text-[9px] sm:text-xs text-retro-cyan text-glow-cyan tracking-wider uppercase">
                  Completa
                </h3>
                <p class="font-body text-lg sm:text-xl text-retro-mute mt-1 leading-relaxed">
                  100% y a por el siguiente. Deja constancia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-10 sm:py-16 animate-slide-in-up">
      <div class="p-8 sm:p-12 max-w-2xl mx-auto text-center relative overflow-hidden"
        style="background:rgba(37,37,80,0.85);border:1px solid rgba(72,219,251,0.35);box-shadow:0 0 30px rgba(72,219,251,0.15),inset 0 0 30px rgba(72,219,251,0.05)">
        <!-- Decorative corner accents -->
        <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-retro-cyan/50" />
        <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-retro-cyan/50" />
        <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-retro-cyan/50" />
        <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-retro-cyan/50" />

        <p class="font-pixel text-sm sm:text-base text-retro-cyan leading-relaxed text-glow-cyan">
          "Para los que no empiezan algo sin terminarlo."
        </p>
        <div class="w-12 h-0.5 bg-retro-cyan mx-auto my-5 opacity-60" />
        <p class="font-body text-retro-mute text-lg sm:text-xl mb-8">
          Únete ahora y toma el control de tu backlog.
        </p>
        <NuxtLink
          :to="isAuthenticated ? '/juegos/nuevo' : '/registro'"
          class="btn-retro bg-retro-cyan text-retro-black shadow-glow-cyan border-b-4 border-cyan-700 inline-block"
        >
          {{ isAuthenticated ? '+ AÑADIR PRIMER JUEGO' : 'CREAR CUENTA GRATIS' }}
        </NuxtLink>
      </div>
    </section>
    </div>
  </div>
</template>

<style scoped>
.dpad-btn {
  position:absolute;
  background:#565e6a;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:background 0.15s ease;
}
.dpad-btn:nth-child(1):active {
  background:linear-gradient(to top, #565e6a 0%, #333 100%);
}
.dpad-btn:nth-child(2):active {
  background:linear-gradient(to right, #565e6a 0%, #333 100%);
}
.dpad-btn:nth-child(3):active {
  background:linear-gradient(to bottom, #565e6a 0%, #333 100%);
}
.dpad-btn:nth-child(4):active {
  background:linear-gradient(to left, #565e6a 0%, #333 100%);
}
.ab-btn {
  transition:box-shadow 0.1s ease-out, border 0.1s ease-out, line-height 0.15s ease-out;
  -webkit-user-select:none;
  user-select:none;
}
.ab-btn:first-child:active {
  box-shadow:-1px 1px 1px #000, inset 0 0 5px #000 !important;
  border-width:0 !important;
  line-height:43px !important;
}
.ab-btn:last-child:active {
  box-shadow:-1px 1px 1px #000, inset 0 0 5px #000 !important;
  border-width:0 !important;
  line-height:48px !important;
}
</style>
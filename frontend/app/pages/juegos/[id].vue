<script setup>
definePageMeta({ title: 'Detalle del juego', requiresAuth: true })

const route = useRoute()
const router = useRouter()
const { getGameById, deleteGame, completeGame, uncompleteGame } = useGames()
const { getCover } = useGameCover()

const game = ref(null)
const error = ref('')
const actionError = ref('')
const showDeleteConfirm = ref(false)
const coverUrl = ref(null)
const coverLoading = ref(true)

onMounted(async () => {
  try {
    game.value = await getGameById(Number(route.params.id))
    getCover(game.value.name).then(url => {
      coverUrl.value = url
      coverLoading.value = false
    })
  } catch {
    error.value = 'Juego no encontrado'
    coverLoading.value = false
  }
})

async function handleDelete() {
  if (!game.value) return
  actionError.value = ''
  try {
    await deleteGame(game.value.id)
    router.push('/juegos')
  } catch (err) {
    actionError.value = err.message || 'Error al eliminar el juego'
  }
}

async function handleComplete() {
  if (!game.value) return
  actionError.value = ''
  try {
    await completeGame(game.value.id)
    game.value = await getGameById(game.value.id)
  } catch (err) {
    actionError.value = err.message || 'Error al completar el juego'
  }
}

async function handleUncomplete() {
  if (!game.value) return
  actionError.value = ''
  try {
    await uncompleteGame(game.value.id)
    game.value = await getGameById(game.value.id)
  } catch (err) {
    actionError.value = err.message || 'Error al deshacer completado'
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div v-if="error" class="pixel-border bg-retro-dark p-6 text-center animate-fade-in">
      <p class="font-pixel text-sm text-retro-red">{{ error }}</p>
      <NuxtLink
        to="/juegos"
        class="inline-block mt-4 btn-retro bg-retro-cyan text-retro-black"
      >
        VOLVER
      </NuxtLink>
    </div>

    <template v-else-if="game">
      <div class="animate-fade-in">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <NuxtLink
              to="/juegos"
              class="font-body text-retro-cyan text-xl hover:text-glow-cyan transition-all duration-200"
            >
              &larr; Volver
            </NuxtLink>
            <h1 class="font-pixel text-xl sm:text-2xl text-retro-text mt-4">
              {{ game.name }}
            </h1>
          </div>
          <PriorityBadge :score="game.priorityScore" />
        </div>

        <div class="pixel-border bg-retro-dark overflow-hidden">
          <div class="relative h-40 sm:h-52 bg-retro-black/60 overflow-hidden border-b border-retro-border/30">
            <div v-if="coverLoading" class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 border-2 border-retro-cyan/30 border-t-retro-cyan rounded-full animate-spin" />
            </div>
            <img
              v-else-if="coverUrl"
              :src="coverUrl"
              :alt="game.name"
              class="w-full h-full object-cover transition-all duration-500"
              loading="lazy"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <span class="font-pixel text-4xl opacity-20 select-none"
                  >[ <span class="text-retro-cyan">?</span> ]</span
                >
                <p class="font-pixel text-[9px] text-retro-mute/30 mt-2">SIN PORTADA</p>
              </div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-retro-dark/90 via-transparent to-transparent pointer-events-none" />
          </div>

          <div class="p-5 sm:p-6 space-y-6">
          <div class="flex flex-wrap items-center gap-3">
            <span class="font-body text-lg bg-retro-black/50 px-3 py-1 text-retro-cyan">
              {{ game.category }}
            </span>
            <span
              v-for="tag in game.tags.split(',')"
              :key="tag"
              class="font-body text-base bg-retro-black/30 px-2 py-0.5 text-retro-mute"
            >
              #{{ tag.trim() }}
            </span>
            <span
              v-if="game.completed"
              class="font-pixel text-[10px] bg-retro-green text-retro-black px-3 py-1"
            >
              COMPLETADO
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="pixel-border bg-retro-black/30 p-3 text-center">
              <p class="font-pixel text-[10px] text-retro-mute mb-1">METACRITIC</p>
              <p class="font-pixel text-lg text-retro-yellow">{{ game.metacriticScore }}</p>
            </div>
            <div class="pixel-border bg-retro-black/30 p-3 text-center">
              <p class="font-pixel text-[10px] text-retro-mute mb-1">HORAS</p>
              <p class="font-pixel text-lg text-retro-cyan">{{ game.hoursToBeat }}h</p>
            </div>
            <div class="pixel-border bg-retro-black/30 p-3 text-center">
              <p class="font-pixel text-[10px] text-retro-mute mb-1">PRIORIDAD</p>
              <p class="font-pixel text-lg" :class="game.priorityScore >= 10 ? 'text-retro-green' : game.priorityScore >= 5 ? 'text-retro-yellow' : 'text-retro-mute'">
                {{ game.priorityScore }}
              </p>
            </div>
          </div>

          <div v-if="game.completed" class="pixel-border bg-retro-black/30 p-4 space-y-2">
            <p class="font-pixel text-[10px] text-retro-green">COMPLETADO EL</p>
            <p class="font-body text-xl text-retro-text">
              {{ game.completedAt ? new Date(game.completedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '' }}
            </p>

            <div v-if="game.rating" class="mt-2">
              <p class="font-pixel text-[10px] text-retro-yellow mb-1">VALORACIÓN</p>
              <p class="font-body text-2xl text-retro-yellow flex gap-1">
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="star <= game.rating ? 'text-retro-yellow text-glow-yellow' : 'text-retro-mute opacity-20'"
                >★</span>
              </p>
            </div>

            <p v-if="game.notes" class="font-body text-lg text-retro-mute italic mt-2">
              "{{ game.notes }}"
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-retro-border">
            <p v-if="actionError" class="font-body text-retro-red text-lg w-full text-center mb-2">
              {{ actionError }}
            </p>
            <BaseButton variant="primary" @click="router.push(`/juegos/edicion/${game.id}`)">
              EDITAR
            </BaseButton>
            <BaseButton
              v-if="!game.completed"
              variant="success"
              @click="handleComplete"
            >
              COMPLETAR
            </BaseButton>
            <BaseButton
              v-else
              variant="ghost"
              class="text-retro-yellow hover:text-retro-green"
              @click="handleUncomplete"
            >
              DESHACER
            </BaseButton>
            <BaseButton variant="danger" @click="showDeleteConfirm = true">
              ELIMINAR
            </BaseButton>
          </div>

          <div
            v-if="showDeleteConfirm"
            class="pixel-border border-retro-red bg-retro-black/50 p-4 mt-2 animate-fade-in"
          >
            <p class="font-body text-retro-red text-lg mb-3">
              ¿Eliminar "{{ game.name }}" para siempre?
            </p>
            <div class="flex gap-3">
              <BaseButton variant="ghost" @click="showDeleteConfirm = false">
                CANCELAR
              </BaseButton>
              <BaseButton variant="danger" @click="handleDelete">
                SÍ, ELIMINAR
              </BaseButton>
            </div>
          </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="font-pixel text-sm text-retro-cyan animate-pulse">CARGANDO...</p>
    </div>
  </div>
</template>

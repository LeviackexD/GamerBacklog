<script setup>
import { authService } from '~/services/authService'

definePageMeta({ title: 'Nueva contraseña' })

const route = useRoute()
const router = useRouter()

const password = ref('')
const passwordRepeat = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

async function handleSubmit() {
  if (password.value !== passwordRepeat.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await authService.resetPassword({
      token: route.query.token,
      password: password.value,
      passwordRepeat: passwordRepeat.value,
    })
    success.value = true
    setTimeout(() => router.push('/login'), 3000)
  } catch (err) {
    if (err.errors) {
      const v = err.errors.find(e => e.field === 'passwordRepeat')
      error.value = v ? v.message : (err.message || 'Error al restablecer')
    } else {
      error.value = err.message || 'Token inválido o expirado'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto animate-fade-in">
    <div class="pixel-border bg-retro-dark p-6 sm:p-8">
      <template v-if="success">
        <h1 class="font-pixel text-lg sm:text-xl text-retro-green text-center mb-4">
          CONTRASEÑA ACTUALIZADA
        </h1>
        <p class="font-body text-retro-text text-lg text-center">
          Redirigiendo al inicio de sesión...
        </p>
      </template>
      <template v-else>
        <h1 class="font-pixel text-lg sm:text-xl text-retro-cyan text-center mb-6">
          NUEVA CONTRASEÑA
        </h1>

        <p v-if="error" class="font-body text-retro-red text-lg text-center mb-4 pixel-border border-retro-red bg-retro-red/10 p-3">
          {{ error }}
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <BaseInput
            v-model="password"
            label="Nueva contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
          />
          <BaseInput
            v-model="passwordRepeat"
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite la contraseña"
          />

          <BaseButton type="submit" variant="primary" class="w-full" :disabled="loading">
            {{ loading ? 'GUARDANDO...' : 'CAMBIAR CONTRASEÑA' }}
          </BaseButton>
        </form>
      </template>

      <p class="font-body text-retro-mute text-lg text-center mt-6">
        <NuxtLink to="/login" class="text-retro-cyan hover:text-glow-cyan transition-all duration-200">
          Volver a inicio de sesión
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

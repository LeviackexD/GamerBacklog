<script setup>
import { authService } from '~/services/authService'

definePageMeta({ title: 'Recuperar contraseña' })

const email = ref('')
const sent = ref(false)
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await authService.forgotPassword(email.value)
    sent.value = true
  } catch (err) {
    error.value = err.message || 'Error al enviar el correo'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto animate-fade-in">
    <div class="pixel-border bg-retro-dark p-6 sm:p-8">
      <template v-if="sent">
        <h1 class="font-pixel text-lg sm:text-xl text-retro-green text-center mb-4">
          EMAIL ENVIADO
        </h1>
        <p class="font-body text-retro-text text-lg text-center">
          Si el email existe, recibirás un enlace para restablecer tu contraseña.
        </p>
      </template>
      <template v-else>
        <h1 class="font-pixel text-lg sm:text-xl text-retro-cyan text-center mb-6">
          ¿OLVIDASTE TU CONTRASEÑA?
        </h1>

        <p v-if="error" class="font-body text-retro-red text-lg text-center mb-4 pixel-border border-retro-red bg-retro-red/10 p-3">
          {{ error }}
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <BaseInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="gamer@example.com"
          />

          <BaseButton type="submit" variant="primary" class="w-full" :disabled="loading">
            {{ loading ? 'ENVIANDO...' : 'ENVIAR ENLACE' }}
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

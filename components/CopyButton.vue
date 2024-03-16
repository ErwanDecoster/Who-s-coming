<script setup lang="ts">
const props = defineProps({
  copyText: String,
})
let text = ref('Copier le code')
const copyText = () => {
  try {
    navigator.clipboard.writeText(props.copyText);
    text.value = 'Copier !'
    setTimeout(() => {
      text.value = 'Copier le code'
    }, 1200)
  } catch (error) {
    text.value = error
  }
}

</script>

<template>
  <button class="secondary-inline ml-1" @click="copyText()">{{ text }}</button>
</template>

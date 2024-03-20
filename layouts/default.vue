<template>
  <div class="flex flex-col mx-auto w-full max-w-screen-xl md:grid md:grid-cols-2 items-center">
    <header class="flex-none flex flex-col justify-center min-h-[20dvh] sm:min-h-[30dvh]">
      <h1>Who's coming</h1>
      <h2>Organisateur d'évènements</h2>
    </header>
    <div class="grow w-full flex flex-col p-2">
      <div class="mx-auto w-full pb-2 max-w-sm flex justify-between">
        <NuxtLink v-if="$route.name?.toString().includes('events-')" to="/events" class="frosted">Mes évènements</NuxtLink>
        <span />
        <NuxtLink class="frosted">Mon compte</NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>
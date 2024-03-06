<template>
  <div class="flex flex-col mx-auto w-full max-w-screen-xl md:grid md:grid-cols-2 items-center">
    <header class="flex-none flex flex-col justify-center min-h-[30dvh]">
      <h1>Who's coming</h1>
      <h2>Organisateur d'évènements</h2>
    </header>
    <div class="grow w-full grid p-2">
      <slot />
    </div>
  </div>
</template>
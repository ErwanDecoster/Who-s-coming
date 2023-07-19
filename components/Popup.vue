<template>
	<div class="fixed inset-0 bg-black bg-opacity-40 z-50" @click.self="$emit('close')">
		<div class="fixed inset-2 h-max max-w-[500px] m-auto bg-app p-2 sm:p-16 rounded-2xl flex flex-col gap-4">
			<button @click.self="$emit('close')" class="absolute top-2 right-2 h-8 w-8 duration-150 hover:rotate-90">
				<span class="bg-white absolute h-1 w-full block rotate-45 -translate-y-1/2 rounded"></span>
				<span class="bg-white absolute h-1 w-full block -rotate-45 -translate-y-1/2 rounded"></span>
			</button>
			<slot class="grid gap-4" />
		</div>
	</div>
</template>
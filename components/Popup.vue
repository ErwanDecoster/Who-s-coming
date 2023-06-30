<template>
	<div class="fixed inset-0 bg-black bg-opacity-40 z-50" @click.self="$emit('close')">
		<div class="fixed inset-2 h-max max-w-[500px] m-auto bg-app p-2 sm:p-16 rounded-2xl flex flex-col gap-4">
			<button @click.self="$emit('close')" class="absolute top-0 right-0 bg-red h-8 w-8">close</button>
			<slot class="grid gap-4" />
		</div>
	</div>
</template>
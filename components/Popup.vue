<template>
	<div class="fixed inset-0 bg-black bg-opacity-40 z-50" @click.self="$emit('close')">
		<div class="fixed inset-2 h-max max-w-[500px] m-auto bg-app p-3 sm:p-16 rounded-2xl grid gap-4">
			<slot class="grid gap-4" />
		</div>
	</div>
</template>
<template>
	<b-container>
		<div class="content p-3">
			home page
		</div>
	</b-container>
</template>

<script>
	export default {
		middleware: ['auth'],
		mounted() {
      console.log("home page mounted!");
    }
	};
</script>
<script>
export let bindvalue;
export let size;
export let maxlength;
</script>


<input type="text" bind:value={bindvalue} size={size} maxlength={maxlength}}>


<style lang="scss">
	input[type=text]{
			height: 1.9rem;
			border: solid 1.2px var(--line-gray-color);
			border-radius: 10px;
	}
	input:focus{
		outline:none;
	}
</style>
<script>
export let bindvalue;
export let size;
export let maxlength;
export let placeholder;
</script>


<input type="text"
	bind:value={bindvalue}
	size={size}
	maxlength={maxlength}
	placeholder={placeholder}
>


<style lang="scss">
	input[type=text]{
			height: 1.9rem;
			border: solid 1.2px var(--line-gray-color);
			border-radius: 5px;
			margin-bottom: 0.7rem;
	}
	input:focus{
		outline:none;
	}
</style>
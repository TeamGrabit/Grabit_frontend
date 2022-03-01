<script>
	export let bindvalue;
	export let size;
	export let maxlength;
	export let placeholder;
</script>

<input type="text"
	bind:value={bindvalue}
	size={size || 34}
	maxlength={maxlength}
	placeholder={placeholder || ''}
>

<style lang="scss">
	input[type=text]{
			color: var(--border-color);
			height: 1.9rem;
			border: solid 1.2px var(--border-color);
			border-radius: 5px;
	}
	input:focus{
		outline:none;
	}
</style>

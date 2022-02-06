<script>
	export let bindvalue;
	export let size=34;
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
			color: var(--line-gray-color);
			height: 1.9rem;
			border: solid 1.2px var(--gray-color);
			border-radius: 5px;
	}
	input:focus{
		outline:none;
	}
</style>

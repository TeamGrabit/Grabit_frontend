<script>
export let bindvalue;
export let size;
export let maxlength;
export let placeholder;
</script>


<!--TODO bind:value 스토어 이용해서 수정하기, 지금은 안먹혀요!-->
<input type="text" bind:value={bindvalue} size={size} maxlength={maxlength} placeholder={placeholder}>


<style lang="scss">
	input[type=text]{
			height: 1.9rem;
			border: solid 1.2px var(--line-gray-color);
			border-radius: 5px;
	}
	input:focus{
		outline:none;
	}
</style>
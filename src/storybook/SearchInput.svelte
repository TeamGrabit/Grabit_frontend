<script>
	export let searchHandler;
	let searchVal = "";

    const onKeyPress = e => {
        if (e.charCode === 13) searchHandler(searchVal);
    };
</script>

<div class="search">
    <input
        type="text"
        placeholder="Search..."
        on:keypress={onKeyPress}
        bind:value={searchVal}
    />
    <img class="search__icon" src="images/search.png" alt="search_img" />
</div>

<style lang="scss">
    input[type=text]{
        height: 2rem;
        width: 300px;
        font-size: 14px;
        padding: 0 0 0 35px;
        border: solid 3px var(--border-color);
        border-radius: 20px;
        &:focus{
            outline:none;
        }
    }
    .search{
        position: relative;

        &__icon{
            position: absolute;
            top: 0.4rem;
            left: 0.7rem;
            width: 1.3rem;
            height: 1.3rem;
        }
        &__btn{
            position: absolute;
            right: 0rem;
            height: 2rem;
            border: solid 3px;
            border-radius: 0px 20px 20px 0px;
            width: 3rem;
        }
    }
</style>

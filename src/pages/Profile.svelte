<script>
let isedit=false;

</script>


    <div class="Item">
        {#if isedit}

        {:else}

        {/if}

        <button on:click={()=>{isedit =!isedit}}>
        Edit
        </button>
    </div>


<style lang="scss">
.Grid{
    display:flex;
    background-color:red;
}
.empty{
}
.Item{
    background-color:green;
    padding-left:100px
}
</style>

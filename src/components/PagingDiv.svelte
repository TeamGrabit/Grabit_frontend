<script>
    let recent_page=1; // 이후 challenge store에서 관리로 변경예정 

    let total_page=100;
    //let total_page=fetchGet()... total_page_num 받아오기

    function returnAllPageNum(){
        let array=Array();
        if(recent_page<100){
            for(let i=1; i<11; i++)
            array.push(i)
        }
        return array
    }
    function clickLeftBtn(){
        //recent_page-10
    }
    function clickRightBtn(){
        //recent_page+10
    }
    function onChange(event){
        //page reload
    }
</script>

<div class='Paging'>
    
    {#if recent_page<10}
        <button class="Paging__move_button" on:click={clickLeftBtn}>&lt;</button>
    {/if}
    
    {#each returnAllPageNum() as i}
        {#if recent_page==i}
            <label class="Paging__button">
                <input checked="checked" type="radio" name="page_num" on:change={onChange} value={i}/>
                <span>{i}</span>
            </label>
        {:else}
            <label class="Paging__button">
                <input type="radio" name="page_num" on:change={onChange} value={i}/>
                <span>{i}</span>
            </label>
        {/if}
    {/each}

    {#if true} <!-- #if recentpage > totalpage-10 -->
        <button class="Paging__move_button" on:click={clickRightBtn}>&gt;</button>
    {/if}
</div>

<style lang='scss'>
    .Paging{
        display: flex;
        flex-direction: row;
        margin-top: 1rem;
        justify-content: center;

        &__button input[type="radio"]{
            display:none;

            &+span{
                display:inline-block;
                background:none;
                border:1px solid #dfdfdf;  
                padding:0px 10px;
                text-align:center;
                height:35px;
                line-height:33px;
                font-weight:500;
                cursor:pointer;
            }
            &:checked+span{
                border:1px solid var(--dark-green-color);
                background:var(--dark-green-color);
                color:#fff;
            }
        }
        &__move_button{
            margin: 0rem 0.2rem;
            background:none;
            border:1px solid #dfdfdf;
            text-align:center;
            font-weight:500;

            &:hover{
                border:1px solid var(--dark-green-color);
                background:var(--dark-green-color);
                color:#fff
            }
        }
    }
</style>

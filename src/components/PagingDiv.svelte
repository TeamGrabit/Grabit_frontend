<script>
    import { totalPages } from '../store/challenge.js'; 
    import { onMount, afterUpdate } from 'svelte';

    export let getDataFunc;

    let recent_page=0;
    let first_page_num=0;
    let button_num_arr=[];

    onMount(()=>{
        returnAllPageNum();
    })

    function returnAllPageNum(){
        let array=Array();
        first_page_num=Math.floor(recent_page/10)*10;

        if(first_page_num+10>$totalPages){
            for(let i=first_page_num; i<$totalPages;i++)
                array.push(i);
        }else{
            for(let i=first_page_num; i<first_page_num+10;i++)
                array.push(i);
        }
        button_num_arr=array;
    }
    function clickLeftBtn(){
        if(recent_page-10<0)
            changeRecentNum(0);
        else
            changeRecentNum(recent_page-10);

        getDataFunc(recent_page);
        returnAllPageNum();
    }
    function clickRightBtn(){
        if(recent_page+10>=$totalPages){
           changeRecentNum($totalPages-1);
        }else{
           changeRecentNum(recent_page+10);
        }
        getDataFunc(recent_page);
        returnAllPageNum();
    }
    const changeRecentNum=(i)=>{recent_page=i}

    $: $totalPages, returnAllPageNum()
</script>

<div class='Paging'>
   {#if $totalPages!=0}
        {#if first_page_num>=10}
            <button class="Paging__move_button" on:click={clickLeftBtn}>&lt;</button>
        {/if}
        {#each button_num_arr as i}
            {#if recent_page==i}
                <label class="Paging__button">
                    <input checked="checked" type="radio" name="page_num" on:change={()=>{getDataFunc(i)}, changeRecentNum(i)}/>
                    <span>{i+1}</span>
                </label>
            {:else}
                <label class="Paging__button">
                    <input type="radio" name="page_num" on:change={()=>{getDataFunc(i), changeRecentNum(i)}}/>
                    <span>{i+1}</span>
                </label>
            {/if}
        {/each}
        {#if first_page_num+10 < $totalPages}
            <button class="Paging__move_button" on:click={clickRightBtn}>&gt;</button>
        {/if}
        
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

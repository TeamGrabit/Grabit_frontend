<script>
    import { totalPages } from '../store/challenge.js'; 
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();


    let recent_page=0;
    let init_i=0;

    function clickPageBtn(i) {
        recent_page=i;
		dispatch('message', {
			recentpage: i
		});
	}
    function returnAllPageNum(){
        let array=Array();
        
        init_i=Math.floor(recent_page/10)*10;

        if(init_i+10>$totalPages){
            for(let i=init_i; i<$totalPages;i++)
                array.push(i);
        }else{
            for(let i=init_i; i<init_i+10;i++)
                array.push(i);
        }
        return array;
    }
    function clickLeftBtn(){
        if(recent_page-10<0)
            recent_page=0;
        else
            recent_page=recent_page-10;

        clickPageBtn(recent_page);
    }
    function clickRightBtn(){
        console.log(recent_page, $totalPages);
        if(recent_page+10>=$totalPages){
            recent_page=$totalPages-1;
        }else{
            recent_page=recent_page+10;
        }
        
        clickPageBtn(recent_page);
    }

</script>

<div class='Paging'>
   {#if $totalPages!=0}
        {#if init_i>=10}
            <button class="Paging__move_button" on:click={clickLeftBtn}>&lt;</button>
        {/if}
    
        {#each returnAllPageNum() as i}
            {#if recent_page==i}
                <label class="Paging__button">
                    <input checked="checked" type="radio" name="page_num" on:change={()=>{clickPageBtn(i)}}/>
                    <span>{i+1}</span>
                </label>
            {:else}
                <label class="Paging__button">
                    <input type="radio" name="page_num" on:change={()=>{clickPageBtn(i)}}/>
                    <span>{i+1}</span>
                </label>
            {/if}
        {/each}

        {#if init_i+10 < $totalPages}
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

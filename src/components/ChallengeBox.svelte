<script>
    import { push, pop } from 'svelte-spa-router';
    import { user } from '../store/user.js';
    export let challenge;

    let isFavorite=false; //임시변수, 이후 유저 즐겨찾기에 있는 챌린지인지 확인으로 변경. 
</script>

<div class='challenge_box'>
    <div class='row_direction'>
        <div class='challenge_name' on:click={()=>{push('/')}}> <!-- 해당 상세 챌린지 페이지 or 가입 링크?로 링크 바꾸기-->
            {challenge.name}
        </div>
        <div class='challenge_opt'>  <!--챌린지에 가입된 유저인지 먼저 확인하기-->
            {#if true}               <!--USER==HOST인지 확인하기-->
                <img class="image" src="images/option.png" alt="option_img" on:click={()=>{push('/')}}/> <!-- 챌린지 관리 페이지로 링크 바꾸기-->
            {/if}
            {#if isFavorite}
                <img class="image" src="images/star2.png" alt="star2_img" on:click={()=>isFavorite=!isFavorite}/>
            {:else}
                <img class="image" src="images/star1.png" alt="star1_img" on:click={()=>isFavorite=!isFavorite}/><!-- 클릭시 유저 즐겨찾는 챌린지 업데이트 하기-->
            {/if}
        </div>
    </div>
    <div class='row_direction'>
        <div class='challenge_intro'>
            {challenge.intro}
        </div>
    </div>
    <div class='row_direction'>
        <div class='challenge_info'>
            <img class="image" src="images/people.png" alt="people_img" />
            <div class="text">{challenge.numpeople}</div>
        </div>
        <div class='challenge_info'>
            <img class="image" src="images/host.png" alt="host_img" />
            <div class="text">{challenge.host}</div>
        </div>
    </div>
</div>

<style lang="scss">
    .challenge_box{
        display: flex;
        flex-direction:column;
        width: 40rem;
        height: 8rem;
        border: solid 3px var(--line-gray-color);
        border-radius: 20px;
        margin: 1rem;
    }
    .row_direction{
        display:flex;
        flex-direction:row;
        align-items: center;
    }
    .challenge_name{
        font-size: 1.2rem;
        font-weight: 600;
        margin: 1.2rem 2rem 1.2rem 2rem;
        color: var(--main-dark-green-color);
    }
    .challenge_opt{
        margin: 1rem 1rem 1rem auto;
    }
    .image{
        margin-right: 0.5rem;
        width: 1.3rem;
        height: 1.3rem;
    }
    .challenge_intro{
        font-size: 0.9rem;
        height: 0.9rem;
        color: var(--gray--color);
        margin: 0rem 4rem 1rem 2rem;
    }
    .challenge_info{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0rem 1rem 1rem 2rem;
    }
    .text{
        font-weight: 600;
    }
</style>

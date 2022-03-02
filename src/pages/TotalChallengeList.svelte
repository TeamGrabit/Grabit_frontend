<script>
    import { challengeList } from '../store/challenge.js';
    
    import Profile from '../components/Profile.svelte';
    import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
    import ChallengeBox from '../components/ChallengeBox.svelte';
    import { Input } from '../storybook'; 

</script>

<!--챌린지 목록 불러오기-->

<GlobalNavigationBar />

<div class='Page'>
    <Profile />
    <div class='Page__content'>
        <div class='Page__search'>
            <Input placeholder='검색할 내용을 입력하세요'/>
        </div>
        <div class='Page__sort'>
            <div class='Page__sort__font'> TITLE </div>
            <div class='Page__sort__font'> DESCRIPTION </div>
            <div class='Page__sort__font'> LEADER </div>
        </div>
        {#each $challengeList as c}
            <ChallengeBox challenge={c} />
        {/each}
    </div>
</div>

<style lang='scss'>
	.Page {
		padding-top: 4%;
		padding-bottom: 4%;
		width: 100%;
		display: flex;
		flex-direction: row;

        &__search {

        }

        &__sort {
            display: flex;
            flex-direction: row;
            margin-top: 1rem;
            width: 60%;
            height: 3rem;
            align-items: center;

                &__font{
                    margin-right: 2.5rem;
                    font-size: 1.3rem;
                    font-weight: 500;
                    text-align: left;
                    &:hover {
		                cursor:pointer;
		                color: var(--dark-green-color);
                }
            }
	    }

        &__content {
			width: 67%;
			margin-top: 2%;
			padding: 1.875rem 0.625rem 0 0.625rem;
        }
    }
</style>

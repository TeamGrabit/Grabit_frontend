<script>
    import { onMount, onDestroy } from 'svelte';
    import { push } from 'svelte-spa-router'
    import { changeTab } from '../store/page';
    import { challengeList } from '../store/challenge.js';
    
    import { index } from '../const/tab';

    import Profile from '../components/Profile.svelte';
    import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
    import ChallengeBox from '../components/ChallengeBox.svelte';
    import { Inputxt, Button, SubNavItem, SearchInput } from '../storybook'; 

    const tabItem = ['\0TITLE', '\0DESCRIPTION', '\0LEADER']

	let activeItem = 0;
    let searchText="";

	function onClickItem(i) {
		activeItem = i;

        switch (i) {    //TODO : 정렬된 challengelist 출력
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                break;
        }
	}
    function setActive(i) {
		if(i === activeItem) return true;
	}
    function onClickCreateChallenge(){
        push('/createchallenge');
    }

	onMount(() => {
		changeTab(index.OTHERS);
	})
</script>

<!--챌린지 목록 불러오기-->

<GlobalNavigationBar />

<div class='Page'>
    <Profile />
    <div class='Page__content'>
        <div class='Page__top'>
            <div class='Page__top__search'>
                <SearchInput
                    bindvalue={searchText}
                />
            </div>
            <div class='Page__top__create_btn'>
                <Button 
                    width='7rem'
                    height='2.5rem'
                    backgroundColor= 'var(--dark-green-color)'
                    onClick={onClickCreateChallenge}  
                >
                    <p>Create</p>
                </Button>
            </div>
        </div>
        <div class='Page__sort'>
                {#each tabItem as item, index}
                    <div class='Page__sort__font'>
                        <SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>{item}</SubNavItem>
                    </div >
                {/each}
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

        &__top {
            display: flex;
            flex-direction: row;
            margin-top: 1rem;
            
            &__search{
                margin-right: auto;
            }
            &__create_btn{
                margin-left: auto;
            }
        }
        &__sort {
            display: flex;
            flex-direction: row;
            margin-top: 1rem;
            width: 60%;
            height: 3rem;
            align-items: center;

                &__font{
                    margin-right: 0.3rem;
                    font-size: 1rem;
                    
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

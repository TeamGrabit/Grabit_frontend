<script>
import ChallengeBox from '../components/ChallengeBox.svelte';
import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
import { challengelist } from '../store/totalchallenge.js';
</script>

<!--챌린지 목록 불러오기-->


<GlobalNavigationBar />

<div class='Page'>
    {#each $challengelist as c}
        <ChallengeBox challenge={c} />
    {/each}
</div>

<style>
.Page{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    padding-top: 6rem;
}
</style>
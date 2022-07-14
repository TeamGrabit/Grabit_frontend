<script>
    import { onMount } from 'svelte';
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";
    import { notifications } from "../store/notifications.js";

    onMount(()=>{
        notifications.reset();
    })
</script>

<div class="notifications">
    {#each $notifications as notification, index (notification.id)}
        <div
            animate:flip
            class="notifications__toast"
            in:fly="{{ x: 100, duration: 1000 }}"
            out:fly="{{ x: 100, duration: 100}}"
        >
            <div class="notifications__toast__message">{notification.message}</div>
            <img class="notifications__toast__button" src="images/x-mark.svg" alt="x-mark" on:click={()=>notifications.remove(index)}/>
        </div>
    {/each}
</div>

<style lang='scss'>
    .notifications {
        position: fixed;
        top: 10px;
        right: 20px;
        padding: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        &__toast {
            display: flex;
            flex: 0 0 auto;
            width: 20rem;
            height: 5rem;
            margin-bottom: 10px;
            background-color: var(--dark-green-color);
            align-items: center;
            justify-content: space-between;
  
            &__message {
                padding: 10px;
                display: block;
                color: white;
                font-weight: 700;
            }

            &__button{
                width: 1rem;
                height: 1rem;
                margin: 0 0.5rem
            }
        }
    }
</style>

<script>
import { onMount} from 'svelte';
import { push, pop } from 'svelte-spa-router';
import { Button, Input } from '../storybook';
import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
import { user } from '../store/user.js';
import { GIT_URL } from '../common/Variable.js';
import { fetchPost } from '../common/fetch';

let name='';
let bio="";
let input;
let showImage = false;
let image;
let file;

onMount(() => {
	name=$user.username;
    bio=$user.bio;
})

function Save(){
    console.log(file);
    console.log(typeof(file));
    fetchPost('image', file,{},{"Content-Type": "multipart/form-data"});

    alert("수정되었습니다.");

}
function Cancel(){
    alert("취소되었습니다.");
    push('/');
}

function onChange() {

    file = input.files[0];

    if (file) {
	    showImage = true;
        const reader = new FileReader();
        reader.addEventListener("load", function () {
        image.setAttribute("src", reader.result);
      });
      reader.readAsDataURL(file);
	  return;
    } 
		showImage = false; 
  }

</script>
<GlobalNavigationBar />

<div class='div'>
    <div class='div__row'>
        <div class='div__column'>
            {#if !showImage}
                {#if $user}
                        <img src='{GIT_URL}/{$user.githubId}.png' alt='userProfile' class="content__profileImg" />
                {/if}
            {:else}
                <img bind:this={image} src="" alt="Preview" class="content__profileImg" />
            {/if}

            <input bind:this={input} on:change={onChange} type="file"/>
        </div>


        <div class='div__column'>
            <div class=text>Name</div>
            <Input bind:bindvalue={name} maxlength=20 size=50 placeholder="Name"/>

            <div class=text>Bio</div>
            <textarea bind:value={bio} placeholder="Add a bio"></textarea>

            <div class='btn__div'>
                <Button 
                    width='7rem'
                    height='2.5rem'
                    backgroundColor='var(--main-green-color)'
                    onClick={Save}
                >	
                    <div class=btn__text>Save</div>
                </Button>

                <Button 
                    width='7rem'
                    height='2.5rem'
                    backgroundColor='#E3E3E3'
                    onClick={Cancel}
                >	
                    <div class=btn__text>Cancel</div>
                </Button>
            </div>
        </div>
    </div>

</div>


<style lang="scss">

    .div{
        display: flex;
        padding-top: 6rem;
        
        &__row{
            display: flex;
            flex-direction: row;
            justify-content:center;
        }
        &__column{
            display: flex;
            flex-direction: column;
            justify-content:center;
            margin: 0rem 1rem;
        }
    }

    .content{

        &__profileImg{
            border: var(--border-color) solid 2px;
            border-radius: 50%;
            display: flex;
            width: 20rem;
            height: 20rem;
            margin: 2rem;
            align-items: center;
        }
    }

    .btn{
        &__div{
            display: flex;
            flex-direction: row;
            justify-content:space-evenly;
            align-items:center;
            padding: 1rem 0rem;
        }
        &__text{
            font-size: 1.0rem;
            font-weight: 600;
        }
    }

    .text{
		font-size: 1.0rem;
        font-weight: 600;
		margin-top:0.7rem;
    	margin-bottom:0.7rem;
	}
    textarea{
        color: var(--line-gray-color);
		border: solid 1.2px var(--border-color);
		border-radius: 5px;
        resize:none;
        height: 6rem;
    }
    textarea:focus{
		outline:none;
	}
</style>
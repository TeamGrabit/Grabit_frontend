<script>
    import { onMount} from 'svelte';
    import { push, pop } from 'svelte-spa-router';
    import { Button, Input } from '../storybook';
    import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
    import { user, getUser } from '../store/user.js';
    import { notifications } from '../store/notifications.js';
    import { GIT_URL } from '../common/Variable.js';
    import { fetchPostFormData, fetchPatch } from '../common/fetch';

    let name='';
    let bio="";

    let input;
    let showImage = false;
    let image;
    let file;

    onMount(() => {
        if($user){
            name=$user.username;
            bio=$user.bio;
        }
    })
    const checkProfileImage = () => {
		if($user.profileImg)
			return $user.profileImg

		return GIT_URL+'/'+$user.githubId+'.png'
	}
    async function Save(){ 
        let body_data

        if(file){
            let form_data = new FormData();
            form_data.append('file', file)
            let photo_url=await fetchPostFormData('image', form_data);

            body_data={ username: name,
                        bio: bio,
                        profileImg: photo_url.url}
        }else{
            body_data={ username: name,
                        bio: bio,
                        profileImg: $user.profileImg}
        }

        await fetchPatch('users', body_data)
        getUser();
        alert("수정되었습니다.");
        push('/');
    }
    function Cancel(){
        alert("취소되었습니다.");   
        push('/');
    }
    function refuseEnter(){
        alert("로그인 이후 접근 가능한 페이지입니다.");   
        push('/login')
    }
    function checkFileType(element){
        const accept_type=['jpg', 'png', 'jpeg', 'PNG', 'JPG', 'JPEG']
        if(accept_type.includes(element))
            return true;
        else
            return false;
    }
    function onChange() {
        if(!input.files[0])
            return;

        let name_arr=(input.files[0].name).split('.');

        if(!checkFileType(name_arr[name_arr.length-1])){
            alert('지원하지 않는 파일 형식입니다.\n지원파일타입: .jpg .png .jpeg')
            return;
        }
        
        file = input.files[0];

        if (file) {
            showImage = true;
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                image.setAttribute("src", reader.result)})

            reader.readAsDataURL(file);
            return;
        } 
        showImage = false; 
    }

</script>

<GlobalNavigationBar />

{#if $user}
    <div class='div'>
        <div class='div__row'>
            <div class='div__column'>
                {#if !showImage}
                    <img src={checkProfileImage()} alt='userProfile' class="content__profileImg" />
                {:else}
                    <img bind:this={image} src="" alt="Preview" class="content__profileImg" />
                {/if}
                <label class="btn__input_image" for="input-file">
                    <div class=btn__text>EDIT</div>
                </label>
                <input bind:this={input} on:change={onChange} type="file" accept=".jpg,.png,.jpeg" id="input-file" style="display:none;"/>
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
{:else}
    {refuseEnter()}
{/if}

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
        &__input_image{
            position: absolute;
            top:27rem;
            left:30rem;
            display: inline-block;
            padding: .5em 1.5em;
            font-size: inherit;
            line-height: normal;
            background-color: #fdfdfd;
            cursor: pointer;
            border: 2px solid var(--border-color);
            border-radius: .25em;
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

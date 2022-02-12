<script>
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { link, push } from 'svelte-spa-router'
	import { user, logout } from '../store/user.js';
	import { GIT_URL } from '../common/Variable.js';
	import { Dropdown, DropdownItem } from '../storybook';

	const name = "Grabit";
	let src = '';
	let isOpenDropdown = false;

	const unsubscribe = user.subscribe(value => {
		src = `${GIT_URL}/${value}.png`;;
	});

	const onClickProfile = () => {
		isOpenDropdown = !isOpenDropdown;
	}
	const onClickOut = () => {
		isOpenDropdown = false;
	}
</script>

<div class="header">
	<div class="header__container">
		<div class="header__logo" on:click={()=>{push('/')}}>
			<img class="header__logo__img" src="images/grabit_logo.png" alt="logo" />
			<div class="header__title">
				{name}
			</div>
		</div>
		{#if $user}
			<span class="header__profile">
				<img 
					{src}
					alt='userProfile'
					class="header__profile__img"
					on:click={onClickProfile}
				/>
				<Dropdown open={isOpenDropdown} {onClickOut} right>
					<DropdownItem onClick=''>내정보</DropdownItem>
					<DropdownItem onClick={logout}>로그아웃</DropdownItem>
				</Dropdown>
			</span>
		{:else}
			<span>guest</span>
		{/if}
	</div>
</div>

<style lang="scss">
	.header{
		height: 3.75rem;
		width: 75rem;
		min-width: 100%;
		border-bottom: #96E6B3 solid 2px;
		box-sizing: border-box;

		&__container{
			padding-top: 0.625rem;
			padding-left: 1.25rem;
			padding-right: 1.25rem;
			height: 2.5rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		&__logo{
			display: flex;
			flex-direction: row;
			align-items: center;
			cursor: pointer;

			&__img{
				height: 2.5rem;
			}
		}

		&__title {
			color: #568259;
			font-size: 1.4rem;
			font-weight: bold;
		}

		&__profile{
			position: relative; // for dropdown

			&__img{
				height: 2rem;
				width: 2rem;
				border-radius: 50%;

				&:hover {
					cursor: pointer;
				}
			}
		}
	}
</style>

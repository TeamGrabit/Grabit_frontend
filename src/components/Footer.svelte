<script>
</script>

<div class="footer">
	<div class="footer_inner">
		<div class="footer_logo">
			<img class="logo_img" src="images/grabit_logo.png" alt="logo" />
			<div class="footer_title">ⓒ Grabit Project</div>
		</div>
		<div class="footer_menu">
			<div class="menu_text">사이트소개</div>
			<div class="menu_text">이용약관</div>
			<div class="menu_text">개인정보처리방침</div>
			<div class="menu_text">고객센터</div>
		</div>
	</div>
</div>
<style lang="scss">
	.footer{
		height: 3.75rem;
		width: 75rem;
		min-width: 100%;
		background-color: #F7F7F7;
		bottom: 0;

		.footer_inner{
			padding-top: 0.625rem;
			padding-right: 20%;
			padding-left: 20%;
			height: 2.5rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			.footer_logo{
				display: flex;
				flex-direction: row;
				align-items: center;

				.logo_img{
					height: 2.5rem;
				}
				.footer_title{
					font-weight: 600;
					font-size: 0.9rem;
				}
			}
			.footer_menu{
				display: flex;
				flex-direction: row;
				align-items: center;

				.menu_text{
					padding-left: 1.875rem;
					font-size: 0.8rem;
					color: #777777;
				}
			}
		}
	}
</style>

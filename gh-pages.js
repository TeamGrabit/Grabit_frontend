var ghpages = require('gh-pages');

ghpages.publish(
	'public', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'https://github.com/TeamGrabit/Grabit_frontend.git', // Update to point to your repository
		user: {
			name: 'MOBUMIN', // update to use your name
			email: 'kiju23@naver.com' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);
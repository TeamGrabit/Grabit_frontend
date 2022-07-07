import App from './App.svelte';
import './common/colorVariable.css';
import * as Stomp from 'stompjs'

const app = new App({
	target: document.body,
	props: {}
});

export default app;
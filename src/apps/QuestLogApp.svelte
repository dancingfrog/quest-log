<script>
	export let title;

	let user;
	let pass;
	let auth;

	function handleLogin(evt) {
		const credentials = `${user}:${pass}`;
		// alert(credentials);
		const base64Credentials = btoa(credentials);
		// alert(base64Credentials);
		user = "**********************************";
		pass = "**********************************";
		auth = `Basic ${base64Credentials}`;
		document.getElementById('myForm').submit();
	}

</script>

<style>
</style>

<h1>{title}</h1>

<form id="myForm" method="POST" action="/api/quest">
	<input name="user" placeholder="username" bind:value="{user}" /><br />
	<input name="pass" placeholder="password" bind:value="{pass}" type="password" /><br />
	<input name="authorization" bind:value="{auth}" type="hidden" />
	<button on:click="{handleLogin}">login</button>
</form>

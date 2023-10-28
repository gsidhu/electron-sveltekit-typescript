<script lang="ts">
  import { onMount } from 'svelte';

  var theChosenOne: string = "Neo";

  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
      element.style.backgroundColor = "yellow";
    }
  };

  async function getProcessVersions() {
    const receivedVersions = await window.electronAPI.requestProcessVersions();
    console.log(typeof(receivedVersions));
    for (const type of ["node", "electron"]) {
      const version = receivedVersions[type];
      if (version) {
        replaceText(`${type}-version`, version);
      }
    }
  }

  onMount(() => {
		getProcessVersions();
	});
</script>

<h1>Welcome to SvelteKit, Mr. { theChosenOne }</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<p>To test our Electron preload script, we are using Node.js v<span id="node-version"></span>, 
Chromium v{window.versions.chrome()}, and Electron v<span id="electron-version"></span>.</p>

<p>The <mark>marked</mark> text is inserted through an ipcRenderer.invoke channel. The Chrome version is inserted via a variable declared in the preload script.</p>
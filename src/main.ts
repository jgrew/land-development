import './app.css'
import App from './App.svelte'
import { setAssetPath } from "@esri/calcite-components/dist/components";

setAssetPath(location.href);

const app = new App({
  target: document.getElementById('app')
})

export default app

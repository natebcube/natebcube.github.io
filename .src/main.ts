import { GameApp } from "./app/app";
import { viewport } from "./app/config";

const WIDTH = viewport.width;
const HEIGHT = viewport.height;

const myGame = new GameApp(document.querySelector('#frame'), WIDTH, HEIGHT);

function resizeApp (app): Function {
  return function () {
    const vpw = window.innerWidth;
    const vph = window.innerHeight;
    let nvw;
    let nvh;
    if (vph / vpw < HEIGHT / WIDTH) {
      nvh = vph;
      nvw = (nvh * WIDTH) / HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * HEIGHT) / WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / WIDTH, nvh / HEIGHT);
  };
}

resizeApp(myGame.app)();

window.addEventListener("resize", () => {
    resizeApp(myGame.app)()
});

window.addEventListener('keydown', evt => {
  const keyCode = evt.keyCode;
  if (keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39) {
    evt.preventDefault();
  }
}, true);
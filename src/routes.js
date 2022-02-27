import CONST from "./utils/constants";
import Landing from "./pages/Landing/Landing";
import Planning from "./pages/Planning/Planning";
import Retro from "./pages/Retro/Retro";

const routes = [
  {
    exact: true,
    path: CONST.LANDING,
    component: Landing,
  },
  {
    path: CONST.PLANNING,
    component: Planning,
  },
  {
    path: CONST.RETRO,
    component: Retro,
  },
];

export default routes;

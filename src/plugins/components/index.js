import HzztComponents from './Hzzt/index'
import Element from './Element'
import Vue from 'vue'
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import VueDND from 'awe-dnd'

export default {
  install() {
    Vue.use(HzztComponents)
    Vue.use(Element)
    Vue.use(VueDND);
    Viewer.setDefaults({
      inline: false,
      button: true,
      navbar: false,
      title: false,
      toolbar: {
        zoomIn: 4,
        zoomOut: 4,
        oneToOne: 4,
        reset: 4,
        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 4,
        rotateRight: 4,
        flipHorizontal: 4,
        flipVertical: 4,
      },
      tooltip: true,
      movable: true,
      zoomable: true,
      zoomRatio: 0.4,
      rotatable: true,
      scalable: true,
      transition: true,
      fullscreen: true,
      keyboard: true,
      zIndex: 3000,
    });
    Vue.use(Viewer);
  }
}

import path from 'path';
import watcher from './util/watcher';
import findMarker from './util/findMarker';

class Bullet {
  constructor(directory, options) {
    this.directory = directory;
    this.options = options;
  }
  onDirChange(directory, files) {
    console.log(directory, files);
    console.log(findMarker(70, path.join(directory, files[0]))); 
  }
  run() {
    const cb = this.onDirChange.bind(this);
    watcher(this.directory, cb);  
  }
}

export default Bullet;

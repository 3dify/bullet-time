import fs from 'fs';
import path from 'path';
import watch from 'watch';
import getSetName from './getSetName';

const CREATED = Symbol('created');
const REMOVED = Symbol('removed');
const UPDATED = Symbol('updated');



export default function watcher(directory, callback) {
  let timeout;
  function refresh(cb) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(cb, 5000);
  }
  console.info('watching', directory.cyan);
  watch.watchTree(directory, function (f, curr, prev) {
    var action;
    if (typeof f == "object" && prev === null && curr === null) {
      // Finished walking the tree
    } else if (prev === null) {
      // f is a new file
      action = CREATED; 
    } else if (curr.nlink === 0) {
      // f was removed
      action = REMOVED;
    } else {
      // f was changed
      action = UPDATED;
    }

    if (action && action !== REMOVED) {
      const setName = getSetName(directory, f);
      const fullPath = path.resolve(directory, setName);
      refresh(() => {
        if (fs.existsSync(fullPath)) {
          console.info('changes on', fullPath.cyan);
          fs.readdir(fullPath, (err, files) => {
            if (err) return console.log(err);
            const filter = file => file.charAt(0) !== '.';
            callback(fullPath, files.filter(filter));
          });
        }
      });
    }
  });
}

import path from 'path';

export default function getSetName(root, file) {
  return file.substring(root.length + path.sep.length).split(path.sep).shift();
}

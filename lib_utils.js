export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function moveItem(arr, from, to) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return

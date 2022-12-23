export function jsonLoader(source) {
  this.addDeps('jsonLoader')
  return `export default ${JSON.stringify(source)}`
}
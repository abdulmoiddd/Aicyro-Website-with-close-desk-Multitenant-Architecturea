// Local Netlify Build plugin: persists the per-design build cache and the
// shared builder/node_modules between deploys.
const DIRS = [".designer-cache", "builder/node_modules"];

module.exports = {
  async onPreBuild({ utils }) {
    for (const dir of DIRS) {
      const ok = await utils.cache.restore(dir);
      console.log(`[designer-cache] ${ok ? "restored" : "no cache for"} ${dir}`);
    }
  },
  async onPostBuild({ utils }) {
    for (const dir of DIRS) {
      const ok = await utils.cache.save(dir);
      console.log(`[designer-cache] ${ok ? "saved" : "nothing to save for"} ${dir}`);
    }
  },
};

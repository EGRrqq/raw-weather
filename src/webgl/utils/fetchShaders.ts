import IPaths from "./interfaces/IPaths";

async function fetchShaders(paths: IPaths) {
  const [vertSource, fragSource] = await Promise.all([
    fetch(paths.vsPath).then((res) => res.text()),
    fetch(paths.fsPath).then((res) => res.text()),
  ]);

  return { vertSource, fragSource };
}

export default fetchShaders;


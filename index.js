// vendor.js 文本替换
// g = (function() {
//   return this;
// })();

// g = (function() {
//   return typeof global !== 'undefined' ? global : this;
// })();

const banner = `
  if (!global && (typeof my !== 'undefined')) {
    var globalModule = require('global');
    var Component = globalModule.AFAppX.WorkerComponent;
    global = globalModule.AFAppX.$global || {};
  }
`;

function mpvueVendorPlugin() {
}

mpvueVendorPlugin.prototype.apply = function(compiler) {
  compiler.plugin("emit", (compilation, callback) => {
    let regExp = /\.js$/;
    let filesName = Object.keys(compilation.assets).filter(name =>
      name.match(regExp)
    );
    filesName.forEach(name => {
      let asset = compilation.assets[name];
      let fileContent = asset.source();
      compilation.assets[name] = {
        source: () => {
          return banner + "\n" + fileContent;
        },
        size: () => {
          return Buffer.byteLength(fileContent, "utf8");
        }
      };
    });
    callback();
  });
};

module.exports = mpvueVendorPlugin;


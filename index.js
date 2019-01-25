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
    const regExp = /\.js$/;
    const filesName = Object.keys(compilation.assets).filter(name =>
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
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('additional-chunk-assets', () => {
      const fileName = 'common/vendor.js';
      const asset = compilation.assets[fileName];
      if (asset) {
        let fileContent = asset.source();
        compilation.assets[fileName] = {
          source: () => {
            let from = /g\s=\s\(function\(\)\s\{\r?\n?\s+return\sthis;\r?\n?\s*\}\)\(\)\;/;
            let to = `g = (function() { return typeof global !== 'undefined' ? global : this; })();`
            fileContent = fileContent.replace(from, to)
            return fileContent;
          },
          size: () => {
            return Buffer.byteLength(fileContent, 'utf8');
          }
        };
      }
    });
  });
};

module.exports = mpvueVendorPlugin;


'use strict';

const fs = require('fs');
const path = require('path');
const db = {};
function loadModels(dir) {
  fs.readdirSync(dir).forEach(file => {
    if (file !== 'index.js') {
      const filepath = path.join(dir, file);
      const stats = fs.statSync(filepath);
      if (stats.isDirectory()) {
        loadModels(filepath);
      } else if (file.slice(-3) === '.js') {
        const fn = file.split(/[\\/]/);
        const modelName = fn[fn.length - 1].split('.')[0];
        const modelDef = require(filepath);
        db[modelName] = modelDef;
      }
    }

  });
}

loadModels(__dirname);


module.exports = db;
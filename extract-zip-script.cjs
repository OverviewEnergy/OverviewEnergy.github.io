const extract = require('extract-zip');
const path = require('path');

(async () => {
  try {
    await extract(path.resolve('attached_assets/overview_website-main_1762007748898.zip'), { 
      dir: path.resolve('attached_assets/website')
    });
    console.log('SUCCESS');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();

module.exports = {
  './src/**/*.{js,jsx,ts,tsx,json,css,scss,md}': ['yarn format:write', 'yarn format:check'],
  './src/**/*.+(js|json|ts|tsx)': ['yarn lint:fix', 'yarn lint'],
};

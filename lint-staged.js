module.exports = {
  './src/**/*.{js,jsx,ts,tsx,json,css,scss,md}': ['yarn format:write', 'yarn format:check', 'git add'],
  './src/**/*.+(js|json|ts|tsx)': ['yarn lint:fix', 'yarn lint', 'git add'],
};

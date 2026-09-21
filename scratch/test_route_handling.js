// Test routing functions logic
const validTabs = ['home-overview', 'scraps-matrix', 'home-chef', 'master-chef', 'ngo-dispatch'];
const aliasMap = {
  'home': 'home-overview',
  'overview': 'home-overview',
  'catalog': 'scraps-matrix',
  'matrix': 'scraps-matrix',
  'scraps': 'scraps-matrix',
  'ingredients': 'scraps-matrix',
  'cook': 'home-chef',
  'recipes': 'home-chef',
  'homechef': 'home-chef',
  'masterchef': 'master-chef',
  'chef': 'master-chef',
  'upload': 'master-chef',
  'ngo': 'ngo-dispatch',
  'dispatch': 'ngo-dispatch',
  'dispatches': 'ngo-dispatch'
};

function resolveTab(rawHash) {
  const hash = rawHash.replace(/^#\/?/, '').trim();
  if (!hash) return 'home-overview';
  return validTabs.includes(hash) ? hash : (aliasMap[hash] || 'home-overview');
}

console.log('Testing route resolution:');
console.assert(resolveTab('') === 'home-overview', 'Empty hash should be home-overview');
console.assert(resolveTab('#') === 'home-overview', '# should be home-overview');
console.assert(resolveTab('#scraps-matrix') === 'scraps-matrix', '#scraps-matrix should resolve');
console.assert(resolveTab('#catalog') === 'scraps-matrix', '#catalog alias should resolve');
console.assert(resolveTab('#home-chef') === 'home-chef', '#home-chef should resolve');
console.assert(resolveTab('#recipes') === 'home-chef', '#recipes alias should resolve');
console.assert(resolveTab('#ngo-dispatch') === 'ngo-dispatch', '#ngo-dispatch should resolve');
console.assert(resolveTab('#ngo') === 'ngo-dispatch', '#ngo alias should resolve');
console.assert(resolveTab('#master-chef') === 'master-chef', '#master-chef should resolve');
console.log('All route resolution assertions passed!');

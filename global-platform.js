// Simple global Platform object that will be available early in the initialization process
const Platform = {
  OS: 'web',
  Version: 1,
  select: function(obj) {
    if (obj && obj.web) return obj.web;
    if (obj && obj.default) return obj.default;
    return null;
  }
};

// Make Platform available globally
if (typeof global !== 'undefined') {
  global.Platform = Platform;
}

if (typeof window !== 'undefined') {
  window.Platform = Platform;
}

module.exports = Platform;

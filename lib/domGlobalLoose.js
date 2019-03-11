require('jsdom-global/register');

document.domain = ''; // default domain

const WRITABLE_WINDOW_PROPERTIES = [
  'navigator',
  'document'
];
WRITABLE_WINDOW_PROPERTIES.forEach(prop => {
  Object.defineProperty(window, prop, {
    writable: true
  });
});

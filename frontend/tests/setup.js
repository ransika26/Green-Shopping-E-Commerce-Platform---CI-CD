import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';
import { expect } from 'vitest';

// Create a simulated browser-like environment
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

copyProps(window, global);

// Extend Vitest's `expect` with custom matchers from Testing Library
expect.extend({
  ...require('@testing-library/jest-dom/matchers'),
});

global.window.matchMedia = global.window.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function () {}, // Deprecated
    removeListener: function () {}, // Deprecated
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () {},
  };
};

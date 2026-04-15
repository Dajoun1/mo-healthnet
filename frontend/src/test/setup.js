import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';


const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => (key in store ? store[key] : null),
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
        get length() { return Object.keys(store).length; },
        key: (index) => Object.keys(store)[index] ?? null,
    };
})();

vi.stubGlobal('localStorage', localStorageMock);

// Reset the store before every test so tests are isolated.
beforeEach(() => {
    localStorageMock.clear();
});

// Automatically cleanup after each test
afterEach(() => {
    cleanup();
});
/* @flow */

declare function describe(message: string, impl: () => void): void;
declare function xdescribe(message: string, impl: () => void): void;

// Syncronous tests
declare function it(message: string, impl: () => void): void;
declare function xit(message: string, impl: () => void): void;
declare function beforeEach(impl: () => void): void;
declare function before(impl: () => void): void;
declare function afterEach(impl: () => void): void;
declare function after(impl: () => void): void;

// Async with callback
declare function it(message: string, impl: (done: Function) => void): void;
declare function xit(message: string, impl: (done: Function) => void): void;
declare function beforeEach(impl: (done: Function) => void): void;
declare function before(impl: (done: Function) => void): void;
declare function afterEach(impl: (done: Function) => void): void;
declare function after(impl: (done: Function) => void): void;

// Async with promise
declare function it(message: string, impl: () => Promise<any>): void;
declare function xit(message: string, impl: () => Promise<any>): void;
declare function beforeEach(impl: () => Promise<any>): void;
declare function before(impl: () => Promise<any>): void;
declare function afterEach(impl: () => Promise<any>): void;
declare function after(impl: () => Promise<any>): void;

import { expect } from 'chai';
import { Greeter } from '../src';

describe('Greeter', () => {
  it('can be initialized', () => {
    const g = Greeter('World');
    expect(g).to.equal("Hello World");
  });
});

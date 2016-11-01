const assert = require('assert');

const Smp = require('../lib/index');

describe('Create JsonTree', () => {

  // TEST 0
  it('should return empty jsonTree', () => {
    const test_0 = new Smp('');
    assert.equal(false, test_0.getJsonTree());
  });

  // TEST 1
  it('should return simple level of jsonTree: \"2+3\"', () => {
    const test_1 = new Smp('2+3');
    const return_1 = [
      {
        number: 2,
        _startIndex: 0,
        _endIndex: 0,
      },
      {
        operator: '+',
        _startIndex: 1,
        _endIndex: 1,
      },
      {
        number: 3,
        _startIndex: 2,
        _endIndex: 2,
      },
    ];
    assert.deepEqual(return_1, test_1.getJsonTree());
  });

});

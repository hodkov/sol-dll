const TestDLL = artifacts.require('TestDLL.sol');
const utils = require('./utils.js');

contract('DLL', () => {
  describe('Function: replace', () => {
    it('Should throw error in non-existent node case', async () => {
      const proxy = await TestDLL.deployed();

      await proxy.insert(0, 1, 0);
      try {
        await proxy.replace(2, 0);
      } catch (err) {
        assert(utils.isEVMException(err), err.toString());

        return;
      }

      assert(false, 'replace a non-existent node');
    });

    it('Should ignore replacing self-positioning node', async () => {
      const proxy = await TestDLL.deployed();

      await proxy.insert(0, 1, 0);
      await proxy.replace(1, 0);

      const start = await proxy.getStart();
      const end = await proxy.getEnd();

      assert.strictEqual(start.toString(10), '1', 'expected start to be 1');
      assert.strictEqual(end.toString(10), '1', 'expected end to be 1');
    });

    it('Should replace a node', async () => {
      const proxy = await TestDLL.deployed();

      await proxy.insert(1, 2, 0);
      await proxy.insert(2, 3, 0);
      await proxy.replace(3, 1);

      const start = await proxy.getStart();
      const end = await proxy.getEnd();
      const next = await proxy.getNext(1);
      const nextAfter = await proxy.getNext(3);

      assert.strictEqual(start.toString(10), '1', 'expected start to be 1');
      assert.strictEqual(end.toString(10), '2', 'expected end to be 2');
      assert.strictEqual(next.toString(10), '3', 'expected next to be 3');
      assert.strictEqual(nextAfter.toString(10), '2', 'expected next after 3 to be 2');
    });
  });
});

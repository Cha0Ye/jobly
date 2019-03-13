process.env.NODE_ENV = 'test';
const  partialUpdate = require('../../helpers/partialUpdate');




describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field",
      function () {
        let table = 'companies';
        let items = {description: 'test description'};
        let key = 'handle';
        let id = 'Test1';

        let partialUpdateResult = partialUpdate(table, items, key, id);
    // FIXME: write real tests!
    expect(partialUpdateResult).toEqual({ query:
      'UPDATE companies SET description=$1 WHERE handle=$2 RETURNING *',
     values: [ 'test description', 'Test1' ] });

  });
});

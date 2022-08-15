describe('shareState example', function () {
  it('should work', function () {
    console.log = jest.fn();
    require('./share-state-example');
    expect((console.log as jest.Mock).mock.calls).toEqual(
      [
        [],
        [{ title: 'Post 0-1' }, { title: 'Post 0-2' }],
        [{ title: 'Post 1-1' }, { title: 'Post 1-2' }],
        [{ title: 'Post 1-1' }, { title: 'Post 1-2' }],
      ].map((arg) => [arg])
    );
  });
});

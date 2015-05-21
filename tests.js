var test = require('tape');
var mori = require('mori');
var Hairball = require('./index');

test("get/put/del", function(t){
  var hb = Hairball();

  var o = {hello: 'world', some: {nested: [{thing: true}, "cool"]}};
  hb.put([], o);

  t.deepEquals(mori.toJs(hb.get([])), o);
  t.deepEquals(mori.toJs(hb.get(['some'])), o.some);
  t.deepEquals(mori.toJs(hb.get(['some', 'nested'])), o.some.nested);
  t.deepEquals(mori.toJs(hb.get(['some', 'nested', 0])), o.some.nested[0]);
  t.deepEquals(mori.toJs(hb.get(['some', 'bad', 'path'])), null);

  hb.del(['some', 'bad', 'path', 'shouldn\'t', 'make', 'keys']);
  t.deepEquals(mori.toJs(hb.get(['some'])), o.some, "del shouldn't make keys if they don't exist");

  hb.put(['some', 'nested', 0], 'not');
  t.deepEquals(mori.toJs(hb.get(['some', 'nested', 0])), 'not');

  hb.del(['some', 'nested']);
  t.deepEquals(mori.toJs(hb.get(['some'])), {});

  hb.del(['some']);
  t.deepEquals(mori.toJs(hb.get()), {hello: 'world'});

  hb.del();
  t.deepEquals(mori.toJs(hb.get()), {});

  t.end();
});

test("onChange", function(t){
  var history = mori.vector();

  var hb = Hairball(function(new_state, old_state, path, value){
    history = mori.conj(history, mori.vector(new_state, old_state, mori.toClj(path), value));
  });

  hb.put([], {hello: 'world'});
  hb.put(['the', 'house', 'is'], {named: 'cool', siding: 'brick'});
  hb.del(['the', 'house', 'is', 'named'])

  t.deepEquals(mori.toJs(hb.get([])), {hello: 'world', the: {house: {is: {siding: 'brick'}}}});

  var state1 = {hello: 'world'};
  var state2 = {hello: 'world', the: {house: {is: {named: 'cool', siding: 'brick'}}}};
  var state3 = {hello: 'world', the: {house: {is: {siding: 'brick'}}}};
  var expected = mori.toClj([
    [state1,     {}, [],                              state1],
    [state2, state1, ['the', 'house', 'is'],          {named: 'cool', siding: 'brick'}],
    [state3, state2, ['the', 'house', 'is', 'named'], null]
  ]);
  t.ok(mori.equals(expected, history));
  t.end();
});

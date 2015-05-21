var mori = require('mori');
var isArray = require('x-is-array');

var normalizePath = function(path){
  return isArray(path) ? path : [path];
};

module.exports = function(onChange){
  var i = mori.hashMap();

  return {
    get: function(path){
      path = normalizePath(path);
      if(path.length === 0){
        return i;
      }
      return mori.getIn(i, path);
    },
    put: function(path, value){
      path = normalizePath(path);
      value = mori.toClj(value);

      var new_i = path.length === 0 ? value : mori.assocIn(i, path, value);
      var old_i = i;
      i = new_i;//mutate before calling onChange
      if(onChange){
        onChange(new_i, old_i, path, value);
      }
      return new_i;
    },
    del: function(path){
      path = normalizePath(path);

      //because dissocIn currently isn't in mori
      var new_i;
      if(path.length === 0){
        new_i = mori.hashMap();
      }else if(path.length === 1){
        new_i = mori.dissoc(i, path[0]);
      }else{
        if(mori.getIn(i, path) == null){//good as gone
          return i;
        }
        var last_key = path.pop();
        new_i = mori.updateIn(i, path, function(v){
          return mori.dissoc(v, last_key);
        });
        path.push(last_key);//undo the mutation to path
      }
      var old_i = i;
      i = new_i;//mutate before calling onChange
      if(onChange){
        onChange(new_i, old_i, path);
      }
      return new_i;
    }
  };
};

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

      var i2 = path.length === 0 ? value : mori.assocIn(i, path, value);
      if(onChange){
        onChange(i2, i, path, value);
      }
      i = i2;
      return i2;
    },
    del: function(path){
      path = normalizePath(path);

      //because dissocIn currently isn't in mori
      var i2;
      if(path.length === 0){
        i2 = mori.hashMap();
      }else{
        if(mori.getIn(i, path) == null){//good as gone
          return i;
        }
        var last_key = path.pop();
        i2 = mori.updateIn(i, path, function(v){
          return mori.dissoc(v, last_key);
        });
        path.push(last_key);//undo the mutation to path
      }
      if(onChange){
        onChange(i2, i, path);
      }
      i = i2;
      return i2;
    }
  };
};

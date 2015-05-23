# hairball
Sane global state management for client side JS apps

# Why is it named hairball?

The term "hairball" is often used to describe something that is complicated or knotted up. We try hard to not have hairballs in our code.

User interfaces are inherently stateful and complicated. All the components in the app need to work together nicely to provide a good user experience.

In effort to keep our UI code simple we employ various patterns such as MVC where we try to encapsulate our stateful hairball. As a result we end up with lots of little components, all with their own hairball of state. This sounds good because we separated our state into little manageable pieces. BUT remember, UI's are inherently complicated and inevitably those nice little components must communicate with each other. So you end up with lots of little hairballs talking to each other which collectively make up one large hairball.

Embrace THE hairball rather than lots of little hariballs.

## What about modularity?

For stuff that is specific to your application, don't worry too much. Inherently they are coupled to your app. Just use the hairball directly.

For reusable components (widgets). Just make them stateless. (Don't use cursors) Have your stateless component take in values and use callbacks to handle events. This way your component can be used in any environment, not just ones that use global immutable data.

### What! No cursors!?!?

They don't embrace the hairball. They try and hide what is really going on.

## Immutable data structures

Hairball uses the excellent [mori](http://swannodette.github.io/mori/) library. When you make a state change, a new immutable value is created and hairball points to it as the source of truth. You can still reference the old values b/c they are immutable. Working with immutable values make your life a ton easier. You don't need to worry about uncontrolled mutation. Achieving consistent, repeatable situations becomes straight forward. You end up with most of your code being simple pure functions.

### Why mori?

 * the most battle tested immutable collections for javascript (thanks to ClojureScript)
 * easy to learn *functional* api
 * uniform iteration for all types
 * darn fast

# How to use it

```js
var Hairball = require('hairball');
var mori = require('hairball/mori');//get the same version of mori that hairball is using
```

## var hb = Hairball(onChange);

Create a new hairball. Optionally pass in a function to be called whenever there is a state change. 

```js
var hb = Hairball(function(new_state, old_state, path, value){
  // triger a re-render or whatever you want to do
});
```

 * `new_state` the new current state of the hairball
 * `old_state` the previous state of the hairball, store this in a collection if you want to implement undo or something
 * `path` the key path that was modified
 * `value` the value that was put in the hairball or undefined if deleted

## var value = hb.get(path)

Get the value at the given key path.

## hb.put(path, value)

Put a new value in the hairball at the given key path. The value can be normal, mutable js collections, hairball will convert them to immutable ones.

## hb.del(path)

Delete the value in the hairball at the given key path.

# License

The MIT License (MIT)

Copyright (c) 2015 Small Helm LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

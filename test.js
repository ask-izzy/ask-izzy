const mc = require('@clevercanyon/js-object-mc');
const utils = require('@clevercanyon/js-object-mc').utils;

mc.addOperation('$removeElm', function(source, params){
  const paths = Object.keys(params);
  for (const path of paths) {
    let valueToRemove = params[path];
    let array = utils.get(source, path, []);
    console.log({source, params, path, valueToRemove, array})
    if (Array.isArray(array)) {
      array = array.filter(elm => elm !== valueToRemove);
      utils.set(source, path, array);
    } else {
      throw new Error('Cannot remove element from something which is not an array');
    }
  }
  return paths.length > 0;
});

mc.addOperation('$applyIfShouldInjectAccessPoints', function(source, params){
    console.log('hiii', {source, params})
    // utils.set(source, "", params);
    // mc.merge()
    mc.patch(source, params)
//   return false;
});

const firstObject = {
    prop1: ['a', 'b'],
    prop2: ['a', 'b'],
    cake: {
        fire: ['1', 2]
    },
    $push: {
        hi: 'fdsf'
    }
  }

const secondObject = {
      prop1: ['c', 'd'],
    //   cake: {
    //       $removeElm: {
    //         fire: '1'
    //     }
    //   }

        cake: {
            $push: {
                fire: '6'
            }
        },
      $applyIfShouldInjectAccessPoints: {
          prop3: 'hiii',

        cake: {
            $push: {
                fire: '1'
            }
        }
      }
  }

let result = mc.merge({}, firstObject)
result = mc.merge(result, secondObject)
console.log(result, firstObject, secondObject);

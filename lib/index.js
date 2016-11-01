/*

  SMC (Simple Mathematics Parser):
  is an parser for simple calculs as '(1 + 2) * 2'

  Pierre MONGE <pierre.monge@epitech.eu>

*/

/*
  Class of Smp
*/
function Smp(buffer) {

  this.jsonTree = [];
  this.buffer = buffer;
  /*
    Fill jsonTree which is a cool arch of json tree as specified as:
    [
      {
        nested: Array,
        operator: String,
        number: Number,
        _startIndex: Number,
        _endIndex: Number,
      },
      { ... },
    ]
  */
  this.getJsonTree = function() {
    let actualString = this.buffer;
    const nestedParenthesis = /\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g;
    const operators = /[\+\-\%\/\*]/;
    const number = /[0-9]/;
    const acceptedChar = /[0-9]|[\+\-\%\/\*]|\(/;

    /*
      get one level of JsonTree without nested, actually nested would be a String
    */
    const getJsonTreeLevel = (actualString, jsonLevel) => {

      /*
        Search nested structure
      */
      let m;
      while ((m = nestedParenthesis.exec(actualString)) !== null) {
        jsonLevel.push({
          nested: m[0],
          _startIndex: m.index,
          _endIndex: m.index + m[0].length - 1,
        });
      }

      /*
        Fill number and operator things
      */
      const searchNested = (index, jsonTreeLevel) => {
        return jsonTreeLevel.find((item) => {
          if (item.hasOwnProperty('nested') && index >= item._startIndex && index <= item._endIndex) {
            return true;
          } else {
            return false;
          }
        });
      };

      let index = 0;
      let tmp = new Object();
      let nested = null;
      while (actualString[index]) {
        if (acceptedChar.exec(actualString[index])) { //regex to match only numbers, operators, and parenthesis

          if ((nested = searchNested(index, jsonLevel))) {
            index = nested._endIndex + 1;
          } else {
            if (operators.exec(actualString[index])
                && jsonLevel.filter((item) => !item.hasOwnProperty('nested') ).length > 0
                && !jsonLevel.isLastProperty(index, 'operator')) {
              tmp.operator = actualString[index];
              tmp._startIndex = tmp._endIndex = index;
              jsonLevel.push(tmp);
              tmp = new Object();
            } else if (number.exec(actualString[index])
                      && ((jsonLevel.filter((item) => !item.hasOwnProperty('nested') ).length > 0 && jsonLevel.isLastProperty(index, 'operator'))
                      || jsonLevel.filter((item) => !item.hasOwnProperty('nested') ).length === 0)) { // search for number
              tmp._startIndex = index;
              tmp.number = actualString[index];
              index++;
              while (number.exec(actualString[index])) {
                tmp.number += actualString[index];
                index++;
              }
              index--;
              tmp._endIndex = index;
              tmp.number = Number(tmp.number);
              jsonLevel.push(tmp);
              tmp = new Object();
            } else {
              throw `Wrong operation:\n\t${actualString.substr(0, index)}\x1b[36m${actualString[index]}\x1b[0m${actualString.substr(index + 1)}\n\t${' '.repeat(index)}^`;
            }
            index++;
          }

        } else if (actualString[index] === ' ') {
          index++;
        } else { // is an error !!!!
          throw `Unknow character:\n\t${actualString.substr(0, index - 1)}\x1b[36m${actualString[index]}\x1b[0m${actualString.substr(index + 1)}\n\t${' '.repeat(index - 1)}^`;
        }
        jsonLevel.sort((itemA, itemB) => {
          return itemA._startIndex - itemB._startIndex;
        });
      }
      if (jsonLevel.length > 0 && jsonLevel[jsonLevel.length - 1].hasOwnProperty('operator')) {
        throw `Wrong operation:\n\t${actualString.substr(0, jsonLevel[jsonLevel.length - 1]._startIndex)}\x1b[36m${jsonLevel[jsonLevel.length - 1].operator}\x1b[0m\n\t${' '.repeat(jsonLevel[jsonLevel.length - 1]._startIndex)}^`;
      }
    };

    /*
      search nested recursivly and fill them
    */
    const getJsonTreeNested = (jsonTreeLevel) => {
      let i = 0;

      while (i < jsonTreeLevel.length) {
        if (jsonTreeLevel[i].hasOwnProperty('nested')) {
          let string = jsonTreeLevel[i].nested.substr(1, jsonTreeLevel[i].nested.length - 2);
          jsonTreeLevel[i] = [];
          getJsonTreeLevel(string, jsonTreeLevel[i]);
          getJsonTreeNested(jsonTreeLevel[i]);
        }
        i++;
      }
    };

    getJsonTreeLevel(actualString, this.jsonTree);
    getJsonTreeNested(this.jsonTree);
    return this.jsonTree;
  }

  this.parse = function() {
    this.getJsonTree();
    return this.jsonTree;
  }
  return true;
};

/*
  Custom prototype
*/
Array.prototype.isLastProperty = function(index, property) {
  const prevItem = this.find((item, itemIndex) => {
    if (itemIndex === this.length - 1) {
      return true;
    } else {
      return index > item._endIndex && index < this[itemIndex + 1]._startIndex;
    }
  });
  if (!prevItem) {
    return false;
  } else {
    return prevItem.hasOwnProperty(property);
  }
};

module.exports = Smp;

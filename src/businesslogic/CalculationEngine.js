class CalculationEngine {

  constructor(expression) {
    this.expression = expression;
  }

  reorganizeArray(array) {
    let reorganized = [];
    let k = -1;

    while (++k < array.length) {
      if (array[k] !== false) {
        reorganized.push(array[k]);
      }
    }

    return reorganized;
  }

  mergeMinusesForOp(array, pointer) {
    let sign = 0;

    while (array[pointer] === '-') {
      array[pointer] = false;
      pointer++;
      sign++;
    }

    if (sign % 2 !== 0) {
      array[pointer] *= -1;
    }

    return this.reorganizeArray(array);
  }

  mergeMinuses(array) {
    let pointer = 0;
    array = this.mergeMinusesForOp(array, pointer);

    pointer += 2;
    array = this.mergeMinusesForOp(array, pointer);

    return this.reorganizeArray(array);
  }

  doTheMath(op, array) {
    let t1 = op - 1;
    let t2 = op + 1;

    let v1 = array[t1];
    let v2 = array[t2];

    switch (array[op]) {
      case '^':
        array[t2] = Math.pow(parseFloat(v1), parseFloat(v2));
        break;
      case '*':
        array[t2] = parseFloat(v1) * parseFloat(v2);
        break;
      case '/':
        if (parseFloat(v2) === 0) {
          return NaN;
        }
        array[t2] = parseFloat(v1) / parseFloat(v2);
        break;
      case '+':
        array[t2] = parseFloat(v1) + parseFloat(v2);
        break;
      case '-':
        array[t2] = parseFloat(v1) - parseFloat(v2);
        break;
      default:
        return NaN;
    }

    array[op] = false;
    array[t1] = false;

    return this.reorganizeArray(array);
  }

  calculate(string) {

    if (string.indexOf('(') >= 0 || string.indexOf(')') >= 0) {
      return NaN;
    }

    // break the string into numbers and operators
    let cArray = (string.match(/([0-9]+\.[0-9]+)|([0-9]+)|\+|-|\^|\*|\//g));
    let i = -1;

    console.log(cArray);

    if (!cArray) {
      return string;
    }

    if (cArray.length === 0) {
      return string;
    }

    if (cArray.length === 1) {
      return cArray[0];
    }

    cArray = this.mergeMinuses(cArray);

    // degree
    while (i++ < cArray.length - 1) {
      if (cArray[i] === '^') {
        cArray = this.doTheMath(i, cArray);
        i--;
      }
    }

    // multiplications/divisions
    i = -1;
    while (i++ < cArray.length - 1) {
      if (cArray[i] === '*') {
        cArray = this.doTheMath(i, cArray);
        i--;
      }

      if (cArray[i] === '/') {
        cArray = this.doTheMath(i, cArray);
        i--;
      }
    }

    // sum/substract
    i = -1;
    while (i++ < cArray.length - 1) {
      if (cArray[i] === '+') {
        cArray = this.doTheMath(i, cArray);
        i--;
      }

      if (cArray[i] === '-') {
        cArray = this.doTheMath(i, cArray);
        i--;
      }
    }
    return cArray[0];
  }

  calculateFull(str) {
    // clean the string from spaces
    str = str.replace(/ /g, '');

    // declare the final result variable
    let result = str;

    //prevent 8(9) from being solved as 89
    if (str.match(/[0-9]\(/gmi) !== null || str.match(/\)[0-9]/gmi)) {
      return NaN;
    }

    // brake the strings there are between parentheses
    let subCalculations = str.match(/\(([^()]+)\)/gmi);
    let subCalc;

    if (!subCalculations) {
      return this.calculate(str);
    }

    for (let k = 0; k < subCalculations.length; k++) {

      subCalc = subCalculations[k].replace(/\(|\)/g, '');
      let calculated = this.calculate(subCalc);
      console.log('Replacing (' + subCalc + ') by ' + calculated);
      result = result.replace('(' + subCalc + ')', calculated);
    }

    // verify if the string still have parentheses and recursively resolves them
    if (result.indexOf('(') >= 0 && result.indexOf(')') > result.indexOf('(')) {
      return this.calculateFull(result);
    } else if (result.indexOf('(') >= 0 || result.indexOf(')') >= 0) {
      return NaN;
    }

    console.log("String after subcalculations are done: " + result);
    return this.calculate(result);
  }
}

export default CalculationEngine;
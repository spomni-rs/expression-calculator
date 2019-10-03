function eval(){return;}

module.exports = {
  expressionCalculator
}

function expressionCalculator(expr){
  expr = removeSpaces(expr);
  expr = convertToArray(expr);
  expr = calculateBrackets(expr);
  return calculate(expr)[0];
}

function removeSpaces(str){
  return str.replace(/ /g, '');
}

function convertToArray(expr){
  let arr = [];
  let numberStr = '';
  
  for (let i=0; i<expr.length; i++){
    let symbol = expr[i];
    
    if (symbol.match(/\d/)){
      numberStr += symbol;
      
    } else {
    
      if (numberStr){
        arr.push(Number(numberStr));
        numberStr = '';
      }
      
      arr.push(symbol);
    }
  }
  
  if (numberStr){
    arr.push(Number(numberStr));
    numberStr = '';
  }
  
  return arr;
}

function calculateBrackets(expr){
  let stack = [];
  
  for (let i=0; i<expr.length; i++){
    let cmd = expr[i];
    
    if (cmd === '('){
      stack.push(i)
    } else if (cmd === ')'){
    
      if (!stack.length){
        throw BracketsError;
      }
    
      let start = stack.pop();
      
      let bracketExpr = expr.splice(start, i - start + 1);
      bracketExpr.shift();
      bracketExpr.pop();
      
      expr.splice(start, 0, calculate(bracketExpr)[0]);
  
      i = start;
    }
  }
  
  if (stack.length){
    throw BracketsError;
  }
  
  return expr;
}


function calculate(expr, operator){

  if (!operator){
    expr = calculate(expr, /[*\/]/);
    expr = calculate(expr, /[-+]/);
  } else {
    
    for (let i=0; i<expr.length; i++){
      let cmd = expr[i];
    
      if ( isString(cmd)
        && cmd.match(operator)
      ){
    
        let res = calculate[cmd](expr[i-1], expr[i+1]);
    
        i--;
        expr.splice(i, 3, res)
      }
    }
  }
  
  return expr;
}

calculate['*'] = (left, right) => {
  return left * right;
}

calculate['/'] = (left, right) => {
  if (right === 0){
    throw DivisionError;
  }
  return left / right;
}

calculate['+'] = (left, right) => {
  return left + right;
}

calculate['-'] = (left, right) => {
  return left - right;
}

const BracketsError = new Error('ExpressionError: Brackets must be paired');

const DivisionError = new Error('TypeError: Division by zero.');


function isString(duck){
  return typeof(duck) === 'string';
}

let indent = '  ';
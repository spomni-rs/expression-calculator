function eval() {
    // Do not use eval!!!
    return;
}

module.exports = {
  expressionCalculator
}

function expressionCalculator(expr){
  expr = expr.replace(/ /g, '');
  exprArr = convertToArray(expr);
  
  return calculate(exprArr);
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

function calculate(expr){

  /* calculate expressions of the brackets */

  const bracketsError = new Error('ExpressionError: Brackets must be paired');
  
  let stack = [];

  for (let i=0; i<expr.length; i++){
    let cmd = expr[i];
    
    if (cmd === '('){
      stack.push(i)
    } else if (cmd === ')'){
    
      if (!stack.length){
        throw bracketsError;
      }
    
      let start = stack.pop();
      
      let bracketExpr = expr.splice(start, i - start + 1);
      bracketExpr.shift();
      bracketExpr.pop();
      
      expr.splice(start, 0, calculate(bracketExpr));

      i = start;
    }
  }
  
  if (stack.length){
    throw bracketsError;
  }
  
  /* multiply and divide */
  
  for (let i=0; i<expr.length; i++){
    let cmd = expr[i];
  
    if (cmd === '*' || cmd === '/'){
    
      let res = calculate[cmd](expr[i-1], expr[i+1]);
        
      i--;
      expr.splice(i, 3, res)
    }
  }
  
  /* plus and minus */
  
  for (let i=0; i<expr.length; i++){
    let cmd = expr[i];
  
    if (cmd === '+' || cmd === '-'){
    
      let res = calculate[cmd](expr[i-1], expr[i+1]);

      i--;
      expr.splice(i, 3, res)
    }
  }
  
  return expr[0];
}

calculate['*'] = (left, right) => {
  return left * right;
}

calculate['/'] = (left, right) => {
  if (right === 0){
    throw new Error('TypeError: Division by zero.')
  }
  return left / right;
}

calculate['+'] = (left, right) => {
  return left + right;
}

calculate['-'] = (left, right) => {
  return left - right;
}
function extractClassName(target: Object) {
  const targetStr = target.toString();

  const withoutClassKeyword = targetStr.substring('class '.length);

  return withoutClassKeyword.substring(0, withoutClassKeyword.indexOf(' '));
}

function extractFunctionName(target: Object) {
  const targetStr = target.toString();

  const withoutClassKeyword = targetStr.substring('function '.length);

  return withoutClassKeyword.substring(0, withoutClassKeyword.indexOf('('));
}

export function extractIdentifierName(target: Object) {
  if (target.toString().startsWith('function')) {
    // To support compilation targets below ES6 (without classes)
    return extractFunctionName(target);
  } else {
    return extractClassName(target);
  }
}

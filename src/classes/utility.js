const digitsStr =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";
const digits = digitsStr.split("");
var digitsMap = {};
for (var i = 0; i < digits.length; i++) {
  digitsMap[digits[i]] = i;
}

export function intToB64(int32) {
  var result = "";
  while (true) {
    result = digits[int32 & 0x3f] + result;
    int32 >>>= 6;
    if (int32 === 0) break;
  }
  return result;
}

export function b64ToInt(digitsStr) {
  var result = 0;
  var digits = digitsStr.split("");
  for (var i = 0; i < digits.length; i++) {
    result = (result << 6) + digitsMap[digits[i]];
  }
  return result;
}

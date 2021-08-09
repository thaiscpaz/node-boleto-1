var formatters = require('../../lib/formatters')

exports.options = {
  logoURL: 'https://raw.githubusercontent.com/natura-pay/node-boleto/NFS-2520/public/images/itau.jpg',
  codigo: '341',
  moeda: '9'
}

exports.dvBarra = function (barra) {
  var resto2 = formatters.mod11(barra, 9, 1)
  return (resto2 == 0 || resto2 == 1 || resto2 == 10) ? 1 : 11 - resto2
}

exports.barcodeData = function (boleto) {
  return boleto['codigo_de_barras']
}

exports.reverseString = function(value){
  return value.split("").reverse().join("");
}

exports.calculaDac = function(valorACalcular){
  var constCalculo = 2;
  var total = 0;
  for (el of this.reverseString(valorACalcular)){
    var valorDigito = el * constCalculo;
    total += valorDigito >= 10 ? parseInt(valorDigito.toString()[0]) + parseInt(valorDigito.toString()[1]) : valorDigito; 
    constCalculo = constCalculo == 2 ? 1 : 2;
  }
  var dac = 10 - (total % 10); 
  return dac == 10 ? 0 : dac.toString();
}

exports.linhaDigitavel = function (barcodeData) {
  var dacCodigoBarras = barcodeData.substring(4, 5);
  var fatorVencimento = barcodeData.substring(5, 9);
  var valor = barcodeData.substring(9, 19);
  var carteira = barcodeData.substring(19, 22);
  var nossoNumero = barcodeData.substring(22, 30);
  var dacMultiplosCampos = barcodeData.substring(30, 31);
  var agBeneficiario = barcodeData.substring(31, 35);
  var contaBeneficiario = barcodeData.substring(35, 40);
  var dacAgConta = barcodeData.substring(40, 41);

  var linhaDigitavelSemDac = this.options.codigo + this.options.moeda + carteira + 
    nossoNumero + dacMultiplosCampos + agBeneficiario + contaBeneficiario + 
    dacAgConta + '000' + dacCodigoBarras + fatorVencimento + valor;
  
  var campo1 = linhaDigitavelSemDac.substring(0, 9) + this.calculaDac(linhaDigitavelSemDac.substring(0, 9));
  var campo2 = linhaDigitavelSemDac.substring(9, 19) + this.calculaDac(linhaDigitavelSemDac.substring(10, 19));
  var campo3 = linhaDigitavelSemDac.substring(19, 29) + this.calculaDac(linhaDigitavelSemDac.substring(19, 29));

  var res = campo1 + campo2 + campo3 + linhaDigitavelSemDac.substring(29);
  res = res.substring(0, 5) + '.' + res.substring(5, res.length);
  res = res.substring(0, 11) + ' ' + res.substring(11, res.length);
  res = res.substring(0, 17) + '.' + res.substring(17, res.length);
  res = res.substring(0, 24) + ' ' + res.substring(24, res.length);
  res = res.substring(0, 30) + '.' + res.substring(30, res.length);
  res = res.substring(0, 37) + ' ' + res.substring(37, res.length);
  res = res.substring(0, 39) + ' ' + res.substring(39, res.length);
  return res;
}

exports.ourNumberDigit = function (boleto) {
  if(boleto['nosso_numero_dv']){
    return boleto['nosso_numero_dv'];
  }else {
    return formatters.mod11(boleto['nosso_numero'].toString());
  }
}
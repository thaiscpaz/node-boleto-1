var formatters = require('../../lib/formatters')

exports.options = {
  logoURL: 'https://raw.githubusercontent.com/natura-pay/node-boleto/NFS-2520/public/images/bv.jpg',
  codigo: '655'
}

exports.dvBarra = function (barra) {
  var resto2 = formatters.mod11(barra, 9, 1)
  return (resto2 == 0 || resto2 == 1 || resto2 == 10) ? 1 : 11 - resto2
}

exports.barcodeData = function (boleto) {
  return boleto['codigo_de_barras']
}

exports.linhaDigitavel = function (barcodeData) {
  // Posição   Conteúdo
  // 1 a 3    Número do banco
  // 4        Código da Moeda - 9 para Real ou 8 - outras moedas
  // 5        Fixo "9'
  // 6 a 9    PSK - codigo cliente (4 primeiros digitos)
  // 10 a 12  Restante do PSK (3 digitos)
  // 13 a 19  7 primeiros digitos do Nosso Numero
  // 20 a 25  Restante do Nosso numero (8 digitos) - total 13 (incluindo digito verificador)
  // 26 a 26  IOS
  // 27 a 29  Tipo Modalidade Carteira
  // 30 a 30  Dígito verificador do código de barras
  // 31 a 34  Fator de vencimento (qtdade de dias desde 07/10/1997 até a data de vencimento)
  // 35 a 44  Valor do título

  var campos = []

  // 1. Primeiro Grupo - composto pelo código do banco, código da moéda, Valor Fixo "9"
  // e 4 primeiros digitos do PSK (codigo do cliente) e DV (modulo10) deste campo
  var campo = barcodeData.substring(0, 3) + barcodeData.substring(3, 4) + barcodeData.substring(19, 20) + barcodeData.substring(20, 24)
  campo = campo + formatters.mod10(campo)
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length)
  campos.push(campo)

  // 2. Segundo Grupo - composto pelas 3 últimas posiçoes do PSK e 7 primeiros dígitos do Nosso Número
  // e DV (modulo10) deste campo
  campo = barcodeData.substring(24, 34)
  campo = campo + formatters.mod10(campo)
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length)
  campos.push(campo)

  // 3. Terceiro Grupo - Composto por : Restante do Nosso Numero (6 digitos), IOS, Modalidade da Carteira
  // e DV (modulo10) deste campo
  campo = barcodeData.substring(34, 44)
  campo = campo + formatters.mod10(campo)
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length)
  campos.push(campo)

  // 4. Campo - digito verificador do codigo de barras
  campo = barcodeData.substring(4, 5)
  campos.push(campo)

  // 5. Campo composto pelo fator vencimento e valor nominal do documento, sem
  // indicacao de zeros a esquerda e sem edicao (sem ponto e virgula). Quando se
  // tratar de valor zerado, a representacao deve ser 0000000000 (dez zeros).
  campo = barcodeData.substring(5, 9) + barcodeData.substring(9, 19)
  campos.push(campo)

  return campos.join(' ')
}

exports.ourNumberDigit = function (boleto) {
  if(boleto['nosso_numero_dv']){
    return boleto['nosso_numero_dv'];
  }else {
    return formatters.mod11(boleto['nosso_numero'].toString());
  }
}

var express = require('express')
var path = require('path')

var app = express()

var Boleto = require('../index').Boleto

boleto = new Boleto({
  'banco': 'bv',
  'data_emissao': new Date('2021-01-21T00:00:00Z'),
  'data_vencimento': new Date('2021-01-31'),
  'valor': 10490,
  'nosso_numero': '1571644678',
  'numero_documento': '0022300000010600000644678',
  'cedente': 'POVIG TECNOLOGIA EM PAGAMENTOS ELETRONICOS LTDA',
  'cedente_cnpj': '35524559000103',
  'agencia': '1111',
  'codigo_cedente': '35524559000103',
  'carteira': '',
  'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
  'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
  'instrucoes': 'Não receber após vencimento',
  'codigo_de_barras': '65592851700000104900000001571500157164467800'
})

console.log(boleto['linha_digitavel']);

app.use(express.static(path.join(__dirname, '/../')))

app.get('/', function (req, res) {
  boleto.renderHTML()
  .then(result => { res.send(result) })
  .catch(err => console.log(err))
})

app.listen(3003)

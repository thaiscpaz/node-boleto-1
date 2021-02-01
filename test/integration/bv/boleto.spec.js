const Boleto = require('../../../index').Boleto
const moment = require('moment')
const expect = require('chai').expect

describe('Santander Boleto', () => {
  describe('when creating a valid boleto', () => {
    let boleto
    before(() => {
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
    })

    it('contains correct bank options', () => {
      expect(boleto.bank.options).to.have.property('logoURL').that.contains('bv.jpg')
      expect(boleto.bank.options).to.have.property('codigo', '655')
    })
    
    it('contains correct barcode_data', () => {
      expect(boleto.barcode_data).to.equal('65592851700000104900000001571500157164467800')
    })

    it('contains correct linha_digitavel', () => {
      expect(boleto.linha_digitavel).to.equal('65590.00002 01571.500154 71644.678006 2 85170000010490')
    })
  })
})


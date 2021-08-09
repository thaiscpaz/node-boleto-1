const Boleto = require('../../../index').Boleto
const moment = require('moment')
const expect = require('chai').expect

describe('Itau Boleto', () => {
  describe('when creating a valid boleto', () => {
    let boleto
    before(() => {
      boleto = new Boleto({
        'banco': 'itau',
        'data_emissao': '2020-06-19',
        'data_vencimento': '2021-12-29',
        'valor': '100',
        'nosso_numero': '30041049',
        'numero_documento': '048949',
        'cedente': 'Henrique Antonio Casagrande Dias de Almeida',
        'cedente_cnpj': '71673990000177',
        'agencia': '2938',
        'codigo_cedente': '47734',
        'carteira': '109',
        'pagador': 'printableBoleto.payer',
        'local_de_pagamento': 'teste',
        'instrucoes': 'Boleto de testes',
        'codigo_de_barras': '34192884900000001001093004783532938477342000'
      })
    })

    it('contains correct bank options', () => {
      expect(boleto.bank.options).to.have.property('logoURL').that.contains('itau.jpg')
      expect(boleto.bank.options).to.have.property('codigo', '341')
    })
    
    it('contains correct barcode_data', () => {
      expect(boleto.barcode_data).to.equal('34192884900000001001093004783532938477342000')
    })

    it('contains correct linha_digitavel', () => {
      expect(boleto.linha_digitavel).to.equal('34191.09305 04783.532932 84773.420009 2 88490000000100');
    })
  })
})


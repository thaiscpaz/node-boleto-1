const boletoMock20181109 = require('../mocks/boleto-2018-11-09')
const boletoMock20181031 = require('../mocks/boleto-2018-10-31')
const expect = require('chai').expect

describe('Boleto render', () => {
  describe('boleto from 2018-11-09', () => {
    it('should have the expiration date as 09/11/2018', async () => {
      const result = await boletoMock20181109.renderHTML()
      expect(result.includes('09/11/2018')).to.be.equal(true)
    })

    it('should have the expiration date as 31/10/2018', async () => {
      const result = await boletoMock20181031.renderHTML()
      expect(result.includes('31/10/2018')).to.be.equal(true)
    })

    it('should convert boleto to PDF buffer', async () => {
      const result = await boletoMock20181031.renderPDF()
      expect(result).to.be.instanceOf(Buffer)
    })
  })
})

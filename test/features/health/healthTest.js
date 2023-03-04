const chai = require('chai')
const sinon = require('sinon')
const HealthController = require('../../../src/features/health/health.controller')
const ResponseUtil = require('../../../src/shared/utils/response-util').ResponseUtil

describe('HealthController', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('helloWorld()', () => {
    it('respond with Hello World', () => {
      sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Hello World')
      })
      void HealthController.helloWorld()
    })
  })

  describe('status()', () => {
    it('respond with status', () => {
      sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Status')
      })
      void HealthController.status()
    })
  })

  describe('error()', () => {
    it('respond with error', () => {
      sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'error')
      })
      void HealthController.error()
    })
  })
})
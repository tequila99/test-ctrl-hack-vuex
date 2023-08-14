import Vue from 'vue'
import Vuex from 'vuex'
import { getInfo, getNewNonce } from '../utils/storage'
import { addOne } from '../utils/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    qty: 0,
    price: 0,
    amount: 0,
    info: getInfo(),
    logs: ''
  },
  getters: {
    displayQty (state) {
      return state.qty ? state.qty.toFixed(0) : ''
    },
    displayPrice (state) {
      return state.price ? state.price.toFixed(2) : ''
    },
    displayAmount (state) {
      return state.amount ? state.amount.toFixed(2) : ''
    },
    enableSend (state) {
      return !!state.amount && !!state.qty && !!state.price
    },
    logs (state) {
      return state.logs
    },
    info (state) {
      return state.info
    }
  },

  mutations: {
    setValue (state, { entity, value }) {
      state[entity] = entity === 'qty' ? parseInt(value) : parseFloat(value)
    },
    setPrice (state, value) {
      state.price = value
    },
    setQty (state, value) {
      state.qty = value
    },
    setAmount (state, value) {
      state.amount = value
    },
    setLogs (state, message) {
      state.logs = Date() + ': ' + message + '\n' + state.logs
    },
    setInfo (state) {
      state.info = getInfo()
    }
  },
  actions: {
    updateValue ({ commit }, payload) {
      commit('setValue', payload)
    },
    updateInfo ({ commit }) {
      commit('setInfo')
    },
    addLog ({ commit }, message) {
      commit('setLogs', message)
    },
    calcPrice ({ commit, state }) {
      commit('setPrice', state.amount / state.qty)
    },
    calcAmount ({ commit, state }) {
      commit('setAmount', state.qty * state.price)
    },
    calcQty ({ commit, state }) {
      commit('setQty', state.amount / state.price)
    },
    async send ({ commit, dispatch, state }) {
      const payload = {
        nonce: getNewNonce(),
        qty: state.qty,
        price: state.price,
        amount: state.amount
      }
      dispatch(
        'addLog',
        `Попытка отправить данные: ${JSON.stringify(payload)} на бекенд. Текущие данные ${state.info || 'отсутствуют'}`
      )

      try {
        const respond = await addOne(payload)
        if (!respond.success) throw new Error(`Ошибка при попытке отправки данных. Ответ сервера ${JSON.stringify(respond)}. Текущие данные ${state.info || 'отсутствуют'}`)
        commit('setInfo')
        dispatch(
          'addLog',
          `Успешная попытка отправки данных. Ответ сервера ${JSON.stringify(respond)}. Текущие данные ${state.info || 'отсутствуют'}`
        )
      } catch (error) {
        dispatch(
          'addLog',
          error.message
        )
      }
    }

  }
})

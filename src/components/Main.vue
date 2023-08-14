<template>
<div class="main-form">
  <div class="main-form__row">
    <div class="main-form__col-3">
      <input type="number" placeholder="Цена" id="price" :value="displayPrice" @input="setValue('price', $event)"/>
      <label class="text-center" for="price">{{ displayPrice }}</label>
    </div>
    <div class="main-form__col-3">
      <input type="text" placeholder="Количество" id="qty" :value="displayQty" @input="setValue('qty', $event)"/>
      <label class="text-center" for="price">{{ displayQty }}</label>
    </div>
    <div class="main-form__col-3">
      <input type="text" id="amount" placeholder="Сумма" :value="displayAmount" @input="setValue('amount', $event)"/>
      <label class="text-center" for="price">{{ displayAmount }}</label>
    </div>
    <div class="main-form__col-3">
      <button :disabled="!enableSend" @click="send">Отправить</button>
      <span class="main-form__info">{{ info  }}</span>
    </div>
  </div>
  <div class="main-form__logs">
    <textarea class="main-form__textarea" name="logs" id="logs" :value="logs"/>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import debounce from '../utils/debounce.js'

export default {
  name: 'Main',
  props: {},
  data () {
    return {
      queue: [],
      lockWatch: false
    }
  },
  watch: {
    qty () {
      if (this.lockWatch) return
      this.addLog(`Измение значения поля ввода количества. Новое значение: ${this.displayQty || 'отсутствует'}`)
      this.calculate('qty')
    },
    price () {
      if (this.lockWatch) return
      this.addLog(`Измение значения поля ввода цены. Новое значение: ${this.displayPrice || 'отсутсвует'}`)
      this.calculate('price')
    },
    amount () {
      if (this.lockWatch) return
      this.addLog(`Измение значения поля ввода суммы. Новое значение: ${this.displayAmount || 'отсутствует'}`)
      this.calculate('amount')
    }
  },
  computed: {
    ...mapGetters([
      'displayQty',
      'displayPrice',
      'displayAmount',
      'enableSend',
      'logs',
      'info'
    ]),
    ...mapState([
      'qty', 'price', 'amount'
    ])
  },
  methods: {
    ...mapActions([
      'addLog',
      'updateValue',
      'calcPrice',
      'calcAmount',
      'calcQty',
      'send'
    ]),
    setValue: debounce(function (entity, event) {
      this.updateValue({ entity, value: event.target.value })
    }, 300),
    calculate (entity) {
      if (this.queue.at(-1) !== entity) this.queue.push(entity)
      if (this.queue.length < 2) return
      if (this.queue.length > 2) this.queue.shift()
      this.lockWatch = true
      if (!this.queue.includes('qty')) this.calcQty()
      if (!this.queue.includes('amount')) this.calcAmount()
      if (!this.queue.includes('price')) this.calcPrice()
      this.$nextTick(() => {
        this.lockWatch = false
      })
    }
  },
  components: {}
}
</script>

<style>
.main-form {
  display: flex;
  flex-direction: column;
  width: 80%;
  height: calc(100vh - 60px);
}
.main-form__row {
  display: flex;
  flex-direction: row;
  height: 120px;
}
.main-form__col-3 {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 30px;
  gap: 40px;
}
.main-form__input {
  text-align: right;
}
.text-center {
  text-align: center;
}
.main-form__logs {
  flex: 1;
  padding: 20px;
}
.main-form__textarea {
  width: 100%;
  height: 100%;
  font-size: 10px
}
.main-form__info {
  font-size: 10px;
  text-align: center;
}
</style>

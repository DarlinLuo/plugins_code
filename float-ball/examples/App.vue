<template>
  <div id="app">
    <suspension-ball @eventEmit="eventEmit" @positionEmit="positionEmit" :zIndex="1002" :distance="{top: 70, left: 10, right: 25, bottom: 10}" :init="{top: 80}"><div class="float-ball-1">悬浮1</div></suspension-ball>
    <suspension-ball @eventEmit="eventEmit" @positionEmit="positionEmit" :zIndex="1002" :distance="{top: 10, left: 10, right: 10, bottom: 10}" :init="{top: 10, left: 10}"><div class="float-ball-2">悬浮2</div></suspension-ball>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Position } from './types/app'
import SuspensionBall from '../src/components/SuspensionBall.vue'

@Component({
  components: {
    SuspensionBall
  }
})
export default class App extends Vue {
  private eventEmit(): void {
    return console.log(`eventEmit`)
  }

  private positionEmit(position: Position): void {
    console.log(`top => ${position.top}  left => ${position.left}`)
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
  .float-ball-1{
    height: 50px;
    width: 50px;
    display:flex;
    flex-wrap: wrap;
    align-items:center;
    align-content:center;
    justify-content: center;
    border-radius: 15px;
    box-shadow: 0 0 25px #999;
    background-color: #fff;
  }

  .float-ball-2{
    height: 100px;
    width: 60px;
    display:flex;
    flex-wrap: wrap;
    align-items:center;
    align-content:center;
    justify-content: center;
    border-radius: 35px;
    box-shadow: 0 0 25px #999;
    background-color: #fff;
  }
}
</style>

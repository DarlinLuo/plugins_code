<template>
  <div :class="['suspension-ball', istransition ? 'active' : '']" ref="moveDiv" @mousedown="down($event)" @touchstart="down($event)" @mousemove="move($event)" @touchmove="move($event)" @touchend="end($event)" :style="{zIndex: zIndex}">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Init, Distance, Position } from '../types/suspensionBall'
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'

@Component
export default class SuspensionBall extends Vue {
  // 组件层级
  @Prop({
    type: Number,
    required: false,
    default: 1001
  }) private zIndex !: number
  // 初始化距离
  @Prop({
    type: Object,
    required: false,
    default: () => {
      return {
        top: 0,
        left: 0
      }
    }
  }) private init !: Init
  // 组件距离
  @Prop({
    type: Object,
    required: false,
    default: () => {
      return {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
      }
    }
  }) private distance !: Distance

  private flags: boolean = false
  private position: Position = { x: 0, y: 0 }
  private nx: number = 0
  private ny: number = 0
  private dx: number = 0
  private dy: number = 0
  private xPum: number = 0
  private yPum: number = 0
  private width: number = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  private height: number = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  private istransition: boolean = false
  private isMove: boolean = false

  private moveDiv: any = null

  private beforeDestroy() {
    document.removeEventListener('mousemove', this.move, false)
    window.removeEventListener('resize', this.checkResize, false)
    document.removeEventListener('mouseup', this.end, false)
  }

  private mounted() {
    document.addEventListener('mousemove', this.move, false)
    document.addEventListener('mouseup', this.end, false)
    window.addEventListener('resize', this.checkResize, false)
    this.$nextTick(() => {
      this.moveDiv = (this.$refs.moveDiv as any)

      const moveDivStyle = this.moveDiv.getBoundingClientRect()

      if (this.init.top) {
        this.moveDiv.style.top = this.init.top + 'px'
      } else {
        this.moveDiv.style.top = this.height - moveDivStyle.height - this.distance.bottom + 'px'
      }
      if (this.init.left) {
        this.moveDiv.style.top = this.init.left + 'px'
      } else {
        this.moveDiv.style.left = this.width - moveDivStyle.width - this.distance.right + 'px'
      }
    })
  }

  @Emit('eventEmit')
  private eventEmit() {
    return
  }

  @Emit('positionEmit')
  private positionEmit(top: number, left: number) {
    return {
      top,
      left
    }
  }

  private checkResize(): void {
    this.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    this.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.$nextTick(() => {
      const moveDivStyle = this.moveDiv.getBoundingClientRect()

      if (this.moveDiv.offsetLeft > this.width / 2) {
        this.moveDiv.style.left = this.width - moveDivStyle.width - this.distance.right + 'px'
      } else {
        this.moveDiv.style.left = this.distance.left + 'px'
      }
      if (this.moveDiv.offsetTop < (moveDivStyle.height + this.distance.top)) {
        this.moveDiv.style.top = this.distance.top + 'px'
      } else if (this.moveDiv.offsetTop > this.height - (moveDivStyle.height + this.distance.bottom)) {
        this.moveDiv.style.top = this.height - (moveDivStyle.height + this.distance.bottom) + 'px'
      }
      this.isMove = false
    })
  }

  // 实现移动端拖拽
  private down(event: any): void {
    this.$nextTick(() => {
      this.flags = true
      let touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      this.position.x = touch.clientX
      this.position.y = touch.clientY
      this.dx = this.moveDiv.offsetLeft
      this.dy = this.moveDiv.offsetTop
    })
  }

  private move(event: any): void {
    this.$nextTick(() => {
      if (this.flags) {
        this.isMove = true
        let touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.nx = touch.clientX - this.position.x
        this.ny = touch.clientY - this.position.y
        this.xPum = this.dx + this.nx
        this.yPum = this.dy + this.ny

        const maxX = document.documentElement.clientWidth - this.moveDiv.offsetWidth // X轴可移动最大距离
        const maxY = document.documentElement.clientHeight - this.moveDiv.offsetHeight // Y轴可移动最大距离
        if (this.xPum < 0) {
          this.xPum = 0
        } else if (this.xPum > maxX) {
          this.xPum = maxX
        }
        if (this.yPum < 0) {
          this.yPum = 0
        } else if (this.yPum > maxY) {
          this.yPum = maxY
        }
        this.moveDiv.style.left = this.xPum + 'px'
        this.moveDiv.style.top = this.yPum + 'px'
      }
    })
  }

  // 鼠标释放时候的函数
  private end(event: any): void {
    this.$nextTick(() => {
      const moveDivStyle = this.moveDiv.getBoundingClientRect()

      this.istransition = true
      if ((event.clientX > this.moveDiv.offsetLeft && event.clientX < this.moveDiv.offsetLeft + this.moveDiv.offsetWidth) && (event.clientY > this.moveDiv.offsetTop && event.clientY < this.moveDiv.offsetTop + this.moveDiv.offsetHeight)) {
        if (!this.isMove) {
          this.eventEmit()
        }
      }
      if (this.isMove) {
        setTimeout(() => {
          if (this.xPum > this.width / 2) {
            this.moveDiv.style.left = this.width - moveDivStyle.width - this.distance.right + 'px'
          } else {
            this.moveDiv.style.left = this.distance.left + 'px'
          }
          if (this.yPum < (moveDivStyle.height + this.distance.top)) {
            this.moveDiv.style.top = this.distance.top + 'px'
          } else if (this.yPum > this.height - moveDivStyle.height - this.distance.bottom) {
            this.moveDiv.style.top = this.height - moveDivStyle.height - this.distance.bottom + 'px'
          }
          this.positionEmit(this.moveDiv.style.top, this.moveDiv.style.left)
          setTimeout(() => {
            this.istransition = false
          }, 500)
        }, 50)
      } else {
        this.istransition = false
      }
      this.isMove = false
      this.flags = false
    })
  }
}
</script>

<style scoped lang="scss">
.suspension-ball {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
  position: fixed;
  touch-action: none;
  user-select: none;
  background-color: transparent;
  &.active {
    transition: all 0.2s ease-in;
  }
}
</style>

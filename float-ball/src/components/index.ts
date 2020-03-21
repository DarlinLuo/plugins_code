import SuspensionBall from './SuspensionBall.vue'

(SuspensionBall as any).install = (Vue: any) => {
    Vue.compoent(SuspensionBall.name, SuspensionBall)
}

export default SuspensionBall

<template>
<!-- ThreeJS 初体验 -->
  <div class="three-wp" ref="threeWp"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {onBeforeUnmount, onMounted, ref} from 'vue'
import gsap from 'gsap'
import * as dat from 'dat.gui'

let scene: THREE.Scene
let perspectiveCamera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let orbitControls: OrbitControls
let canvas: HTMLCanvasElement
let rotateAnimation
let moveAnimation

const threeWp = ref<HTMLElement>()

onMounted(() => {
  // 创建一个场景
  scene = new THREE.Scene()
  // 创建透视相机
  perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  perspectiveCamera.position.z = 6
  // 创建渲染器
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  canvas = renderer.domElement
  threeWp.value!.appendChild(renderer.domElement)
  // 创建轨道控制器
  orbitControls = new OrbitControls(perspectiveCamera, renderer.domElement)
  // 启用阻尼时必须要在render函数中调用update
  orbitControls.enableDamping = true
  // 创建坐标轴
  const axesHelper = new THREE.AxesHelper(4)
  scene.add(axesHelper)
  // 创建几何体
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  // 创建基础材质（基础材质不受光照影响）
  const material = new THREE.MeshBasicMaterial({
    color: 0xFA844B,
    wireframe: true
  })
  // 创建立方体
  const cube = new THREE.Mesh(boxGeometry, material)
  scene.add(cube)

  // 设置环境光
  // const ambientLight = new THREE.AmbientLight(0x404040)
  // scene.add(ambientLight)

  // 动画
  moveAnimation = gsap.to(cube.position, {
    x: 3,
    repeat: -1,
    duration: 3,
    yoyo: true,
    ease: 'power1.inOut'
  })

  rotateAnimation = gsap.to(cube.rotation, {
    x: Math.PI * 2,
    duration: 2,
    repeat: -1,
    ease: 'none'
  })
  // 创建用户交互界面
  const gui = new dat.GUI()
  gui.add(cube.scale, 'x')
      .min(0)
      .max(5)
      .step(0.01)
      .name('cube的x轴缩放')
      .onChange(() => {})
      .onFinishChange(() => {})
  console.log(cube)
  render()
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('dblclick', toggleFullscreen)
  window.addEventListener('click', pauseOrPlay)

})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('dblclick', toggleFullscreen)
  window.removeEventListener('click', pauseOrPlay)
})

// 设置窗口变化监听
function onWindowResize() {
  perspectiveCamera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机投影矩阵
  perspectiveCamera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 设置动画函数
function render() {
  requestAnimationFrame(render)
  orbitControls.update()
  renderer.render(scene, perspectiveCamera)
  // 更新屏幕像素比
  renderer.setPixelRatio(window.devicePixelRatio)
}

// 启用退出全屏
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    canvas.requestFullscreen()
  }
}
// 动画播放或暂停
function pauseOrPlay() {
  rotateAnimation.paused() ? rotateAnimation.play() : rotateAnimation.pause()
  moveAnimation.paused() ? moveAnimation.play() : moveAnimation.pause()
}

</script>

<template></template>
<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {or} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
const container = ref<HTMLElement>()

let scene: THREE.Scene
let perspectiveCamera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let orbitControls: OrbitControls
let canvas: HTMLCanvasElement

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
  document.body.appendChild(renderer.domElement)
  // 创建轨道控制器
  orbitControls = new OrbitControls(perspectiveCamera, renderer.domElement)
  orbitControls.enableDamping = true
  // 创建坐标轴
  const axesHelper = new THREE.AxesHelper(4)
  scene.add(axesHelper)
  // 创建几何体
  const boxGeometry = new THREE.BoxGeometry(2, 2, 2)
  // 创建基础材质（基础材质不受光照影响）
  const material = new THREE.MeshBasicMaterial({
    color: 0xFA844B
  })
  // 创建立方体
  const cube = new THREE.Mesh(boxGeometry, material)
  scene.add(cube)

  // 设置环境光
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  render()
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('dblclick', toggleFullscreen)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('dblclick', toggleFullscreen)
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
  // 启用阻尼时必须要在render函数中调用update
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

</script>

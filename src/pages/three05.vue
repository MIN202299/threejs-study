<template>
<!-- ThreeJS pbr -->
  <div class="three-wp" ref="threeWp"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {onBeforeUnmount, onMounted, ref} from 'vue'

let scene: THREE.Scene
let perspectiveCamera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let orbitControls: OrbitControls
let canvas: HTMLCanvasElement

const threeWp = ref<HTMLElement>()

onMounted(() => {
  // 创建一个场景
  scene = new THREE.Scene()
  // 创建透视相机
  perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  perspectiveCamera.position.z = 3
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
  /************************** START ******************************/

  const boxGeometry = new THREE.PlaneGeometry(5, 2, 200, 100)
  // 设置纹理加载器
  const loadManager = new THREE.LoadingManager(onLoad, onProgress, onError)
  // 纹理加载
  const textureLoader = new THREE.TextureLoader(loadManager)
  // 颜色贴图
  const stoneColorTexture = textureLoader.load('/textures/WallMedieval003/WallMedieval003_COL_VAR1_3K.jpg')
  // Ao环境贴图
  const aoTexture = textureLoader.load('/textures/WallMedieval003/WallMedieval003_AO_3K.jpg')
  // ao贴图需要第二组uv
  boxGeometry.setAttribute('uv2', new THREE.BufferAttribute(boxGeometry.attributes.uv.array, 2))
  // 置换贴图
  const displacementTexture = textureLoader.load('/textures/WallMedieval003/WallMedieval003_DISP_VAR2_3K.jpg')
  // 法线贴图
  const normalTexture = textureLoader.load('/textures/WallMedieval003/WallMedieval003_NRM_3K.jpg')
  // 粗糙度贴图
  const roughnessTexture = textureLoader.load('/textures/WallMedieval003/WallMedieval003_REFL_3K.jpg')
  // stoneColorTexture.offset.set(0.9, 0.9)
  // stoneColorTexture.rotation = Math.PI / 2
  // stoneColorTexture.wrapS = THREE.RepeatWrapping
  // stoneColorTexture.wrapT = THREE.RepeatWrapping
  // console.log(stoneColorTexture)
  const standardMaterial = new THREE.MeshStandardMaterial({
    map: stoneColorTexture,
    transparent: true,
    aoMap: aoTexture,
    aoMapIntensity: 15,
    displacementMap: displacementTexture,
    displacementScale: 0.1,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    roughness: 0.1,
    // wireframe: true
  })

  const mesh = new THREE.Mesh(boxGeometry, standardMaterial)
  scene.add(mesh)


  /**************************  END  ******************************/


  // 设置环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambientLight)
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
  directionalLight.position.set(0, 0, 5)
  scene.add(directionalLight)

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
// 纹理加载
function onProgress(e, itemsLoaded, itemsTotal) {
  console.log('正在加载', e, itemsLoaded, itemsTotal)
}
function onLoad(e) {
  console.log('加载完成', e)
}
function onError(e) {
  console.log('加载出错', e)
}

</script>

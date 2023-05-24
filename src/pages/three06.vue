<template>
<!-- ThreeJS 环境贴图 -->
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
  perspectiveCamera.position.z = 5
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

  const boxGeometry = new THREE.SphereGeometry(2, 30, 30)
  const boxGeometry2 = new THREE.SphereGeometry(2, 30, 30)
  // 设置纹理加载器
  const loadManager = new THREE.LoadingManager(onLoad, onProgress, onError)
  // 纹理加载
  const textureLoader = new THREE.TextureLoader(loadManager)
  // 正方形纹理加载器
  const cubeTextureLoader = new THREE.CubeTextureLoader(loadManager)
  const envTexture = cubeTextureLoader.setPath('/textures/GoldenGateBridge/')
      .load([
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg',
      ])
  scene.background = envTexture
  // 给场景所有物体添加环境贴图
  scene.environment = envTexture
  const standardMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    // envMap: envTexture,
    metalness: 1,
    roughness: 0
  })

  const mesh = new THREE.Mesh(boxGeometry, standardMaterial)
  const mesh2 = new THREE.Mesh(boxGeometry2, standardMaterial)
  mesh.position.set(-2, 0, 0)
  mesh2.position.set(2, 0, 0)
  scene.add(mesh)
  scene.add(mesh2)


  /**************************  END  ******************************/


  // 设置环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  // scene.add(ambientLight)
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
  directionalLight.position.set(0, 0, 5)
  // scene.add(directionalLight)

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
function onLoad() {
  console.log('加载完成')
}
function onError(e) {
  console.log('加载出错', e)
}

</script>

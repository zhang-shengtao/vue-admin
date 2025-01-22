<template>
  <div class="login">
    <main class="main">
      <div class="t item"></div>
      <div class="r item"></div>
      <div class="b item"></div>
      <div class="l item"></div>
    </main>
    <div class="from">
      <h2 class="title">登录</h2>
      <input type="text" v-model.trim="fromData.username" class="input" placeholder="请输入账号" />
      <div style="position: relative">
        <input :type="isPassword ? 'text' : 'password'" v-model.trim="fromData.password" class="input" maxlength="15" minlength="6" style="padding: 0 30px 0 15px" placeholder="请输入密码" />
        <my-icon class="isPassword" @click="isPassword = !isPassword" :name="isPassword ? 'View' : 'Hide'" />
      </div>
      <el-divider style="top: 10px"> <span style="color: rgb(205, 209, 212)">欢迎使用本系统</span> </el-divider>
      <el-button class="submit" type="primary" :loading="isSubmit" @click="loginSubmit">登录</el-button>
    </div>
    <div class="model"></div>
  </div>
</template>

<script setup>
  // import { login } from "@/api/user";
  import { setStorage } from "@/utils/storage.js";
  import { storageKey } from "#/config.js";
  const router = useRouter();
  const isPassword = ref(false);
  const isSubmit = ref(false);
  const fromData = reactive({
    username: "",
    password: "",
  });

  function loginSubmit() {
    if (!fromData.username) return ElMessage("请填写账号");
    if (!fromData.password) return ElMessage("请填写密码");
    isSubmit.value = true;
    setStorage(storageKey.token, Math.random().toString(16).substr(2));
    setTimeout(() => {
      isSubmit.value = false;
      router.push("/");
    }, 2000);
  }
</script>

<style lang="scss" scoped>
  .login {
    overflow: hidden;
    height: 100vh;
    .main {
      --durM: 6s;
      --durD: 0.5s;
      --size: 20em;
      --depth: calc(var(--size) * 6);
      --bgPos: calc(var(--size) * 0.3);
      --endX1: 33%;
      --endX2: 67%;
      --endY1: 40%;
      --endY2: 60%;
      animation: po var(--durM) ease-in-out infinite;
      margin: auto;
      overflow: hidden;
      perspective: 5em;
      perspective-origin: 50% 50%;
      position: relative;
      width: var(--size);
      height: var(--size);
      transform: scale(6);
    }

    .main:before,
    .item {
      position: absolute;
    }

    .main:before {
      -webkit-animation: end var(--durM) ease-in-out infinite;
      animation: end var(--durM) ease-in-out infinite;
      background: currentColor;
      box-shadow: 0 0 1em 1em;
      color: #000;
      content: "";
      display: block;
      margin: -0.5em -0.5em;
      width: 1em;
      height: 1em;
      top: 50%;
      left: 50%;
      z-index: 5;
    }

    .item {
      background: conic-gradient(#000 25%, #fff 0 50%, #000 0 75%, #fff 0) 0 0 / var(--bgPos) var(--bgPos);
    }

    .t,
    .l {
      top: 0;
      left: 0;
      transform-origin: 0 0;
    }

    .r,
    .b {
      right: 0;
      bottom: 0;
      transform-origin: 100% 100%;
    }

    .t,
    .b {
      width: 100%;
      height: var(--depth);
    }

    .r,
    .l {
      filter: brightness(70%);
      width: var(--depth);
      height: 100%;
    }

    .t {
      -webkit-animation: t var(--durD) linear infinite;
      animation: t var(--durD) linear infinite;
      background-position: 0 calc(var(--bgPos) / 2);
      filter: brightness(40%);
      transform: rotateX(-90deg);
    }

    .r {
      -webkit-animation: r var(--durD) linear infinite;
      animation: r var(--durD) linear infinite;
      background-position: calc(var(--bgPos) / 2) 0;
      transform: rotateY(-90deg);
    }

    .b {
      -webkit-animation: b var(--durD) linear infinite;
      animation: b var(--durD) linear infinite;
      transform: rotateX(90deg);
    }

    .l {
      -webkit-animation: l var(--durD) linear infinite;
      animation: l var(--durD) linear infinite;
      transform: rotateY(90deg);
    }

    @keyframes po {
      from,
      to {
        perspective-origin: var(--endX1) var(--endY1);
      }
      25% {
        perspective-origin: var(--endX2) var(--endY1);
      }
      50% {
        perspective-origin: var(--endX2) var(--endY2);
      }
      75% {
        perspective-origin: var(--endX1) var(--endY2);
      }
    }

    @keyframes t {
      to {
        transform: rotateX(-90deg) translateY(calc(var(--bgPos) * -1));
      }
    }

    @keyframes r {
      to {
        transform: rotateY(-90deg) translateX(var(--bgPos));
      }
    }

    @keyframes b {
      to {
        transform: rotateX(90deg) translateY(var(--bgPos));
      }
    }

    @keyframes l {
      to {
        transform: rotateY(90deg) translateX(calc(var(--bgPos) * -1));
      }
    }

    @keyframes end {
      from,
      to {
        top: var(--endY1);
        left: var(--endX1);
      }
      25% {
        top: var(--endY1);
        left: var(--endX2);
      }
      50% {
        top: var(--endY2);
        left: var(--endX2);
      }
      75% {
        top: var(--endY2);
        left: var(--endX1);
      }
    }

    .from {
      width: 350px;
      padding: 10px 20px;
      background-color: #fff;
      border-radius: 20px;
      position: absolute;
      top: 20%;
      left: calc(50% - 175px);
      z-index: 3;
      box-sizing: border-box;
      .title {
        text-align: center;
        margin: 12px 0;
      }
      .input {
        outline: none;
        border-style: none;
        border-radius: 0.75rem;
        padding: 0 15px;
        width: 100%;
        height: 44px;
        background-color: rgb(243 244 246);
        box-sizing: border-box;
        margin-top: 25px;
        box-shadow:
          0 0 #0000,
          0 0 #0000,
          0 0 #0000,
          0 0 #0000,
          0 10px 15px -3px rgb(0 0 0 / 0.1),
          0 4px 6px -4px rgb(0 0 0 / 0.1);
        font-family: inherit;
        font-feature-settings: inherit;
        font-variation-settings: inherit;
        font-size: 100%;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
      }
      .isPassword {
        position: absolute;
        right: 10px;
        top: 55%;
      }
      .submit {
        width: 100%;
        height: 44px;
        border-radius: 15px;
        margin: 20px 0 30px 0;
      }
    }
    .model {
      position: absolute;
      top: 20%;
      left: calc(50% - 175px);
      width: 350px;
      height: 357px;
      background-color: red;
      z-index: 2;
      border-radius: 20px;
      transform: rotate(8deg);
    }
    .model::after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background-color: rgb(255, 217, 0);
      border-radius: 20px;
      transform: rotate(339deg);
    }
  }
</style>

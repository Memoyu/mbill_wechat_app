<template>
    <view class="magic">{{text}}</view>
</template>

<script>
export default {
  name: "magicText",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss">
.magic {
    position: relative;
    margin: auto;
    width: 120px;
    line-height: 100px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: $primaryColor;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid $primaryColor;
        transition: all .5s;
        animation: clippath 3s infinite linear;
    }
}

@keyframes clippath {
    0%,
    100% {
        clip-path: inset(0 0 95% 0);
    }
    
    25% {
        clip-path: inset(0 95% 0 0);
    }
    50% {
        clip-path: inset(95% 0 0 0);
    }
    75% {
        clip-path: inset(0 0 0 95%);
    }
}
</style>

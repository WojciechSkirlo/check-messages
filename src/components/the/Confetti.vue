<template>
  <Particles
    id="tsparticles"
    :particles-init="particlesInit"
    :options="optionsParticles"
  />
</template>

<script setup lang="ts">
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

const optionsParticles = {
  fullScreen: {
    zIndex: 1,
  },
  particles: {
    number: {
      value: 0,
    },
    color: {
      value: ["#000000", "#f3f4f6", "#bbbbbb", "#333333"],
    },
    shape: {
      type: ["square", "triangle", "polygon"],
      options: {
        polygon: [
          {
            sides: 5,
          },
          {
            sides: 6,
          },
        ],
      },
    },
    opacity: {
      value: 1,
      animation: {
        enable: true,
        minimumValue: 0,
        speed: 0.5,
        startValue: "max",
        destroy: "min",
      },
    },
    size: {
      value: 3,
      random: {
        enable: true,
        minimumValue: 2,
      },
    },
    links: {
      enable: false,
    },
    life: {
      duration: {
        sync: true,
        value: 10,
      },
      count: 1,
    },
    move: {
      enable: true,
      gravity: {
        enable: true,
        acceleration: 12,
      },
      speed: {
        min: 30,
        max: 50,
      },
      decay: 0.1,
      direction: "top",
      straight: false,
      outModes: {
        default: "destroy",
      },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      direction: "random",
      move: true,
      animation: {
        enable: true,
        speed: 60,
      },
    },
    tilt: {
      direction: "random",
      enable: true,
      move: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 60,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: {
        min: 15,
        max: 25,
      },
    },
    wobble: {
      distance: 30,
      enable: true,
      move: true,
      speed: {
        min: -15,
        max: 15,
      },
    },
  },
  emitters: {
    life: {
      count: 1,
      duration: 0.1,
      delay: 0.4,
    },
    rate: {
      delay: 0.1,
      quantity: 200,
    },
    size: {
      width: 0,
      height: 0,
    },
    position: {
      x: 50,
      y: 30,
    },
  },
};

const particlesInit = async (engine: Engine) => {
  await loadFull(engine);
};
</script>

<script setup lang="ts">
import { useLog } from '../data'

const { logs } = useLog()
</script>

<template>
  <ul>
    <li v-for="log in logs.toReversed()" :key="log">
      {{ log }}
    </li>
  </ul>
</template>

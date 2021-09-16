<script lang="ts">
  import NumberLine from "./NumberLine.svelte";

  export let numbers: number[] = [];
</script>

<div class="numbers-container">
  {#each numbers as number}
    <NumberLine {number} />
  {/each}
</div>

<style>
  .numbers-container {
    width: 100%;
    height: 500px;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
</style>

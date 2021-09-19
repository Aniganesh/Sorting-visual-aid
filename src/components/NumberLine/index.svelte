<script lang="ts">
  import { numberLinePxPerUnit } from "./Constants";

  export let number: number;
  export let isBeingCompared: boolean | undefined;
</script>

{#if number !== undefined}
  <div
    style={`height: ${number * numberLinePxPerUnit}px`}
    class={`main-div ${isBeingCompared ? "compare" : ""}`}
    id={number.toString()}
  >
    <div class="number">{number}</div>
  </div>
{/if}

<style>
  .main-div {
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: red;
    margin-right: 10px;
    position: relative;
    transition: all ease 500ms;
  }
  .number {
    position: absolute;
    bottom: -20px;
    color: black;
  }
  .compare {
    background-color: #99cf87;
  }
</style>

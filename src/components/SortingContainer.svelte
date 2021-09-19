<script lang="ts">
  import Button from "smelte/src/components/Button";
  import NumberLine from "./NumberLine/index.svelte";
  import {
    numberLinePxPerUnit,
    numberLineSpacing,
    numberLineWidth,
  } from "./NumberLine/Constants";
  import { SortTypes } from "../@types";
  import mainStore from "../Stores";

  let minIndex,
    comparingIndices,
    sortWithWait = mainStore.sortWithWait,
    numbers: number[];

  mainStore.subscribe((value) => {
    minIndex = value.minIndex;
    comparingIndices = value.comparingIndices;
    numbers = value.numbers;
  });

  const sort = async () => {
    await sortWithWait(1, SortTypes.SELECTION);
  };
  let numbersContainer;
  let numberLineAreaBegin;
  $: numberLineAreaBegin =
    (numbersContainer?.clientWidth -
      numbers.length * (numberLineWidth + numberLineSpacing) -
      numberLineSpacing) /
    2;
</script>

<div class="top-container">
  <div class="numbers-container" bind:this={numbersContainer}>
    {#if minIndex !== undefined}<div
        style={`bottom: ${numberLinePxPerUnit * numbers[minIndex]}px; 
        left: ${
          numberLineAreaBegin +
          minIndex *
            (numberLineWidth + (minIndex === 0 ? 0 : numberLineSpacing))
        }px`}
        class="minIndicator"
      >
        <span>min</span><span>^</span>
      </div>{/if}
    {#each numbers as number, index}
      <NumberLine isBeingCompared={comparingIndices.includes(index)} {number} />
    {/each}
  </div>
  <div>
    <div>
      {minIndex !== undefined ? numbers[minIndex] : ""}
    </div>
    <Button
      on:click={() => {
        if (numbers.length) {
          sort();
        }
      }}>sort</Button
    >
  </div>
</div>

<style>
  .numbers-container {
    /* width: 100%; */
    height: 500px;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 600px;
  }
  .top-container {
    display: flex;
    align-items: center;
    width: 700;
  }
  .minIndicator {
    position: absolute;
    color: black;
    display: flex;
    flex-direction: column;
    transition: left ease 300ms, top ease 300ms;
  }
  .minIndicator > span:not(:first-child) {
    transform: rotate(180deg);
  }
</style>

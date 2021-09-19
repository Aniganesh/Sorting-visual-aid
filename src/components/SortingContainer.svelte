<script lang="ts">
  import { waitSeconds } from "../resources/utils";
  import { arrayMoveImmutable as arrayMove } from "array-move";
  import NumberLine from "./NumberLine/index.svelte";
  import {
    numberLinePxPerUnit,
    numberLineSpacing,
    numberLineWidth,
  } from "./NumberLine/Constants";

  let comparingIndices = [];
  let minIndex: number;
  enum SortTypes {
    SELECTION = "selection",
    MERGE = "merge",
    QUICK = "quick",
    BUBBLE = "bubble",
  }

  const sortWithWait = async (
    numbers: number[],
    wait: number,
    type: SortTypes
  ) => {
    switch (type) {
      case SortTypes.SELECTION:
        selectionSortWithWait(numbers, wait);
        break;
      case SortTypes.MERGE:
        throw new Error("Not implemented");
        break;
      case SortTypes.QUICK:
        throw new Error("Not implemented");
        break;
      case SortTypes.BUBBLE:
        throw new Error("Not implemented");
        break;
    }
    return numbers;
  };

  const selectionSortWithWait = async (unsorted: number[], wait: number) => {
    for (let i = 0; i < unsorted.length; ++i) {
      minIndex = i;
      for (let j = i + 1; j < unsorted.length; ++j) {
        comparingIndices = [minIndex, j];
        if (i === j) {
          continue;
        }
        await waitSeconds(wait);
        if (unsorted[j] < unsorted[minIndex]) {
          minIndex = j;
        }
      }
      const partiallySorted = arrayMove(unsorted, minIndex, i);
      unsorted = partiallySorted;
      numbers = unsorted;
      minIndex = i;
      await waitSeconds(wait);
    }
    comparingIndices = [];
    minIndex = undefined;
    return unsorted;
  };

  export let numbers: number[] = [];
  const sort = async () => {
    numbers = await sortWithWait(numbers, 1, SortTypes.SELECTION);
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
    <button
      on:click={() => {
        if (numbers.length) {
          sort();
        }
      }}>sort</button
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

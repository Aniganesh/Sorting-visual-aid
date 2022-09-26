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
  import { createForm } from "svelte-forms-lib";

  let minIndex,
    comparingIndices,
    sortWithWait = mainStore.sortWithWait,
    numbers: number[];
  const sortTypes = [
    // SortTypes.BUBBLE,
    // SortTypes.MERGE,
    // SortTypes.QUICK,
    SortTypes.SELECTION,
  ];
  mainStore.subscribe((value) => {
    minIndex = value.stateInfo.minIndex;
    comparingIndices = value.comparingIndices;
    numbers = value.numbers;
  });

  const {
    handleChange: sortTypeChange,
    form,
    handleSubmit: sortTypeSubmit,
  } = createForm({
    initialValues: {
      sortType: SortTypes.SELECTION,
    },
    onSubmit: ({ sortType }: { sortType: SortTypes }) => {
      if (numbers.length) mainStore.sortWithWait(1, sortType);
    },
  });
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
    {#if minIndex !== undefined}
      <div
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
      {minIndex !== undefined ? `Minimum: ${numbers[minIndex]}` : ""}
    </div>
    <form on:submit={sortTypeSubmit}>
      <fieldset>
        <legend>Select sort type</legend>
        {#each sortTypes as sortType}
          <label>
            <input
              type="radio"
              name="sortType"
              on:change={sortTypeChange}
              bind:value={sortType}
              checked={$form.sortType === sortType}
            />
            {sortType.toUpperCase()}
          </label>
        {/each}
      </fieldset>

      <Button type="submit" on:click={sortTypeSubmit}>sort</Button>
    </form>
  </div>
</div>

<style>
  .numbers-container {
    height: 500px;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 800px;
  }
  .top-container {
    display: flex;
    align-items: center;
    width: 1000px;
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

<script lang="ts">
  import Button from "smelte/src/components/Button";
  import NumberLine from "./NumberLine/index.svelte";
  import {
    numberLinePxPerUnit,
    numberLineSpacing,
    numberLineWidth,
  } from "./NumberLine/Constants";
  import { SortTypes } from "../@types";
  import mainStore, { SortAnimation } from "../Stores";
  import { createForm } from "svelte-forms-lib";

  let minIndex,
    animations: SortAnimation[],
    numbers: number[],
    comparingIndices: [number, number],
    speed: number;
  let position = 0;
  let paused = false;
  let isSorting = false;
  const sortTypes = [
    // SortTypes.BUBBLE,
    // SortTypes.MERGE,
    // SortTypes.QUICK,
    SortTypes.SELECTION,
  ];
  mainStore.subscribe((value) => {
    animations = value.sortAnimations;
    numbers = value.numbers;
    speed = value.speed;
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
      if (numbers.length) {
        mainStore.sort(sortType);
        if (animations.length) {
          paused = false;
          isSorting = true;
          animate();
        }
      }
    },
  });

  const animate = (_position: number = 0) => {
    if (_position >= animations.length) {
      isSorting = false;
      return;
    }

    position = _position;
    const {
      comparingIndices: _comparingIndices,
      minIndex: _minIndex,
      swap: _swap,
    } = animations[_position];

    if (_minIndex !== undefined && _minIndex !== null) {
      minIndex = _minIndex;
    }

    if (_comparingIndices) comparingIndices = _comparingIndices;

    if (_swap && _swap.length === 2) {
      let temp = numbers[_swap[0]];
      numbers[_swap[0]] = numbers[_swap[1]];
      numbers[_swap[1]] = temp;
    }
    if (!paused)
      setTimeout(() => {
        animate(_position + 1);
      }, speed);
  };
  const onSpeedChange = (event) => {
    mainStore.setSpeed(5000 - (event.currentTarget as { value: number }).value);
  };
  let speedInputValue = 5000 - speed;
  let numbersContainer;
  let numberLineAreaBegin;
  $: numberLineAreaBegin =
    (numbersContainer?.clientWidth -
      numbers.length * (numberLineWidth + numberLineSpacing) -
      numberLineSpacing) /
    2;
  let buttonText;
  $: buttonText = paused ? "Resume" : "Pause";
  const togglePause = () => {
    if (paused) {
      paused = false;
      animate(position + 1);
    } else {
      paused = true;
    }
  };
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
      <NumberLine
        isBeingCompared={comparingIndices?.includes(index)}
        {number}
      />
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
    <br />
    <label>
      Speed
      <input
        type="range"
        min="100"
        max="5200"
        step="100"
        bind:value={speedInputValue}
        on:change={onSpeedChange}
      />
    </label>
    {#if isSorting !== false}
      <Button on:click={togglePause}>
        {buttonText}
      </Button>
    {/if}
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

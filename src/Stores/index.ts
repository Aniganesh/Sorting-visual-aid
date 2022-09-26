import { writable } from "svelte/store";
import { SortTypes } from "../@types";
import { waitSeconds } from "../resources/utils";
import { arrayMoveImmutable as arrayMove } from "array-move";

interface Store {
  numbers: number[];
  comparingIndices: number[];
  stateInfo: {
    minIndex?: number;
    phase?: "split" | "merge";
  };
}

const createStore = () => {
  const { subscribe, set, update } = writable<Store>({
    numbers: [],
    comparingIndices: [],
    stateInfo: { minIndex: undefined },
  });
  const setNumbers = (numbers: number[]) => {
    update((values) => {
      return { ...values, numbers };
    });
  };
  const customUpdate = (newValues: Partial<Store>) => {
    update((values) => {
      return { ...values, ...newValues };
    });
  };
  const updatePostMerge = (start: number, sortedArray: number[]) => {
    update((values) => {
      const before = values.numbers.slice(0, start);
      const after = values.numbers.slice(start + sortedArray.length);
      return { ...values, numbers: before.concat(sortedArray).concat(after) };
    });
  };
  const sortWithWait = async (wait: number, type: SortTypes) => {
    switch (type) {
      case SortTypes.SELECTION:
        selectionSortWithWait(wait);
        break;
      case SortTypes.MERGE:
        mergeSortWithWait(wait);
        break;
      case SortTypes.QUICK:
        throw new Error("Not implemented");
      case SortTypes.BUBBLE:
        throw new Error("Not implemented");
    }
  };
  const selectionSortWithWait = async (wait: number) => {
    let numbers: number[];
    let stateInfo;
    subscribe((value) => {
      numbers = value.numbers;
      stateInfo = value.stateInfo;
    });
    for (let i = 0; i < numbers.length; ++i) {
      customUpdate({ stateInfo: { ...stateInfo, minIndex: i } });
      for (let j = i + 1; j < numbers.length; ++j) {
        customUpdate({ comparingIndices: [stateInfo.minIndex, j] });
        if (i === j) {
          continue;
        }
        await waitSeconds(wait);
        if (numbers[j] < numbers[stateInfo.minIndex]) {
          customUpdate({ stateInfo: { ...stateInfo, minIndex: j } });
        }
      }
      const partiallySorted = arrayMove(numbers, stateInfo.minIndex, i);
      customUpdate({
        numbers: partiallySorted,
        stateInfo: { ...stateInfo, minIndex: i },
      });
      await waitSeconds(wait);
    }
    customUpdate({ comparingIndices: [], stateInfo: { minIndex: undefined } });
  };
  const mergeSortWithWait = async (wait: number) => {
    let numbers: number[], stateInfo;
    subscribe((values) => {
      numbers = values.numbers;
      stateInfo = values.stateInfo;
    });
    if (numbers.length) {
      const sorted = await mergeSort(numbers, wait, 0, false);
      customUpdate({ numbers: sorted });
    }
  };

  const mergeArrays = async (
    leftArray: number[],
    rightArray: number[],
    wait: number
  ) => {
    const sorted = [];
    while (leftArray.length && rightArray.length) {
      if (leftArray[0] < rightArray[0]) {
        sorted.push(leftArray.shift());
      } else {
        sorted.push(rightArray.shift());
      }
      await waitSeconds(wait);
    }
    while (leftArray.length) {
      sorted.push(leftArray.shift());
    }
    while (rightArray.length) {
      sorted.push(rightArray.shift());
    }
    return sorted;
  };

  const mergeSort = async (
    unsortedArray: number[],
    wait: number,
    position: number,
    parallel = false
  ): Promise<number[]> => {
    if (unsortedArray.length < 2) {
      return unsortedArray;
    }
    const midIndex = Math.floor(unsortedArray.length / 2);
    const leftSubArray = unsortedArray.slice(0, midIndex);
    const rightSubArray = unsortedArray.slice(midIndex);
    console.log("mergeSort", {
      midIndex,
      leftSubArray,
      rightSubArray,
      unsortedArray,
    });
    if (parallel) {
      const merged = await mergeArrays(
        await mergeSort(leftSubArray, 0, position, parallel),
        await mergeSort(rightSubArray, 0, position, parallel),
        0
      );
      updatePostMerge(position, merged);
      return merged;
    } else {
      const leftSorted = await mergeSort(
        leftSubArray,
        wait,
        position,
        parallel
      );
      const rightSorted = await mergeSort(
        rightSubArray,
        wait,
        position,
        parallel
      );

      const merged = await mergeArrays(leftSorted, rightSorted, wait);
      updatePostMerge(position, merged);
      return merged;
    }
  };

  return {
    subscribe,
    setNumbers,
    sortWithWait,
  };
};
export const mainStore = createStore();
export default mainStore;

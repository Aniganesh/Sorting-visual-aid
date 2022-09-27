import { writable } from "svelte/store";
import { SortTypes } from "../@types";
// import { waitSeconds } from "../resources/utils";
export interface SortAnimation {
  comparingIndices?: [number, number];
  swap?: [number, number];
  minIndex?: number;
}

interface Store {
  numbers: number[];
  sortAnimations: SortAnimation[];
  speed: number;
}

const createStore = () => {
  const { subscribe, set, update } = writable<Store>({
    numbers: [],
    sortAnimations: [],
    speed: 200,
  });
  const setNumbers = (numbers: number[]) => {
    update((values) => {
      return { ...values, numbers };
    });
  };
  const setSpeed = (speed: number) => {
    update((values) => ({ ...values, speed }));
  };
  const setAnimations = (sortAnimations: SortAnimation[]) => {
    update((values) => {
      return { ...values, sortAnimations };
    });
  };
  const sort = async (type: SortTypes) => {
    let numbers: number[];
    subscribe((value) => {
      numbers = value.numbers;
    });
    switch (type) {
      case SortTypes.SELECTION:
        const [sortAnimations, sortedArray] = selectionSort(numbers.slice());
        setAnimations(sortAnimations);
        console.log(
          "Is sort working:",
          sortedArray,
          numbers.slice().sort((a, b) => a - b),
          areArraysEqual(
            sortedArray,
            numbers.slice().sort((a, b) => a - b)
          )
        );
        return;
      case SortTypes.MERGE:
        throw new Error("Not implemented");
      case SortTypes.QUICK:
        throw new Error("Not implemented");
      case SortTypes.BUBBLE:
        throw new Error("Not implemented");
    }
  };

  return {
    subscribe,
    setNumbers,
    sort,
    setSpeed,
  };
};
export const mainStore = createStore();
export default mainStore;

const selectionSort = (
  unsortedArray: number[]
): [SortAnimation[], number[]] => {
  const animations = [];
  let sorted = unsortedArray.slice();
  let _minIndex: number;
  let temp;
  animations.push({ minIndex: 0 });
  for (let i = 0; i < sorted.length; ++i) {
    _minIndex = i;
    animations.push({ minIndex: _minIndex });
    for (let j = i + 1; j < sorted.length; ++j) {
      const comparingIndices = [_minIndex, j];
      animations.push({ minIndex: _minIndex, comparingIndices });
      if (sorted[_minIndex] > sorted[j]) {
        _minIndex = j;
        animations.push({ minIndex: _minIndex });
      }
    }
    const swap = [_minIndex, i];
    temp = sorted[i];
    sorted[i] = sorted[_minIndex];
    sorted[_minIndex] = temp;
    animations.push({ swap, minIndex: i });
  }
  return [animations, sorted];
};

const areArraysEqual = (array1: number[], array2: number[]) => {
  if (array1.length !== array2.length) return false;
  for (let i in array1) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
};

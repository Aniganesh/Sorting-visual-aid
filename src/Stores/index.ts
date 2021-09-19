import { writable } from "svelte/store";
import { SortTypes } from "../@types";
import { waitSeconds } from "../resources/utils";
import { arrayMoveImmutable as arrayMove } from "array-move";

interface Store {
  numbers: number[];
  comparingIndices: number[];
  minIndex?: number;
}

const createStore = () => {
  const { subscribe, set, update } = writable<Store>({
    numbers: [],
    comparingIndices: [],
    minIndex: undefined,
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
  const sortWithWait = async (wait: number, type: SortTypes) => {
    switch (type) {
      case SortTypes.SELECTION:
        selectionSortWithWait(wait);
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
  };
  const selectionSortWithWait = async (wait: number) => {
    let numbers: number[], minIndex: number;
    subscribe((value) => {
      numbers = value.numbers;
      minIndex = value.minIndex;
    });
    for (let i = 0; i < numbers.length; ++i) {
      customUpdate({ minIndex: i });
      for (let j = i + 1; j < numbers.length; ++j) {
        customUpdate({ comparingIndices: [minIndex, j] });
        if (i === j) {
          continue;
        }
        await waitSeconds(wait);
        if (numbers[j] < numbers[minIndex]) {
          customUpdate({ minIndex: j });
        }
      }
      const partiallySorted = arrayMove(numbers, minIndex, i);
      customUpdate({ numbers: partiallySorted, minIndex: i });
      await waitSeconds(wait);
    }
    customUpdate({ comparingIndices: [], minIndex: undefined });
  };
  return {
    subscribe,
    setNumbers,
    sortWithWait,
  };
};
export const mainStore = createStore();
export default mainStore;

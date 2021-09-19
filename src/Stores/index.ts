import { writable } from "svelte/store";
import { SortTypes } from "../@types";
import { waitSeconds } from "../resources/utils";
import { arrayMoveImmutable as arrayMove } from "array-move";

const mainStore = {
  numbers: [],
  comparingIndices: [],
  minIndex: undefined,

  sortWithWait: async function (this, wait: number, type: SortTypes) {
    switch (type) {
      case SortTypes.SELECTION:
        this?.selectionSortWithWait(this.numbers, wait);
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
  },
  selectionSortWithWait: async function (this, wait: number) {
    for (let i = 0; i < this.numbers.length; ++i) {
      this.minIndex = i;
      for (let j = i + 1; j < this.unsorted.length; ++j) {
        this.comparingIndices = [this.minIndex, j];
        if (i === j) {
          continue;
        }
        await waitSeconds(wait);
        if (this.numbers[j] < this.numbers[this.minIndex]) {
          this.minIndex = j;
        }
      }
      const partiallySorted = arrayMove(this.numbers, this.minIndex, i);
      this.numbers = partiallySorted;
      this.minIndex = i;
      await waitSeconds(wait);
    }
    this.comparingIndices = [];
    this.minIndex = undefined;
  },
};

export const main = writable(mainStore);
export default main;

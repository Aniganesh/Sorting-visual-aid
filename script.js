"use strict";

const generateNumsButton = document.querySelector("#generatenums");
const numValuesRequiredInp = document.querySelector("#count");
const dataset = document.querySelector("#dataset");
const sortButton = document.querySelector("#sort");
const progressBar = document.querySelector(".progress-bar");

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateNums = () => {
    const count = numValuesRequiredInp.value;
    let vals = [];

    while (vals.length < count) {
        vals.push(Math.floor(Math.random() * 100));
    }

    return vals;
};

const createAndAppendNodes = (values) => {
    progressBar.style.setProperty("width", 0);
    let nodes = dataset.querySelectorAll(".data-item");
    if (nodes.length > 0) {
        [...nodes].forEach((node) => {
            node.parentNode.removeChild(node);
        });
    }
    [...values].forEach((value) => {
        const div = document.createElement("div");
        div.setAttribute("data-value", value);
        div.style.setProperty("height", value + "%");
        div.classList.add("data-item");
        // div.classList.add("gi-" + colNum++);
        dataset.appendChild(div);
    });
};

const sort = () => {
    if (document.querySelector("#brute").checked) {
        bruteForce();
        return;
    }

    if (document.querySelector("#quick").checked) {
        quickSortWrapper();
        return;
    }

    if (document.querySelector("#bubble").checked) {
        bubbleSort();
        return;
    }
};

async function bruteForce() {
    let vals = [...dataset.querySelectorAll(".data-item")];
    const totalComparisonsReq = vals.length * vals.length;
    let comparisonsMade = 0;
    for (let i = 0; i < vals.length; ++i) {
        for (let j = 0; j < vals.length; ++j) {
            if (i != j) {
                if (!document.body.contains(vals[i]) ||
                    !document.body.contains(vals[j])
                ) {
                    return;
                }
                vals[i].classList.add("compare");
                vals[j].classList.add("compare");
                const node1val = parseInt(vals[i].getAttribute("data-value"));
                const node2val = parseInt(vals[j].getAttribute("data-value"));

                if (node2val > node1val) {
                    vals[i].setAttribute("data-value", node2val);
                    vals[i].style.setProperty("height", node2val + "%");
                    vals[j].setAttribute("data-value", node1val);
                    vals[j].style.setProperty("height", node1val + "%");
                }
                await sleep(800);
                vals[i].classList.remove("compare");
                vals[j].classList.remove("compare");
            }
            progressBar.style.setProperty(
                "width",
                (++comparisonsMade / totalComparisonsReq) * 100 + "%"
            );
        }
    }
}



async function bubbleSort() {
    let vals = [...dataset.querySelectorAll(".data-item")];
    let sorted = false;
    let counter = 0;
    const totalComparisonsReq = (vals.length * (vals.length - 1)) / 2;
    let comparisonsMade = 0;

    while (!sorted) {
        sorted = true;

        for (let i = 0; i < vals.length - 1 - counter; ++i) {
            const node1val = parseInt(vals[i].getAttribute("data-value"));
            const node2val = parseInt(vals[i + 1].getAttribute("data-value"));
            vals[i].classList.add("compare");
            vals[i + 1].classList.add("compare");

            if (node2val < node1val) {
                vals[i].setAttribute("data-value", node2val);
                vals[i].style.setProperty("height", node2val + "%");
                vals[i + 1].setAttribute("data-value", node1val);
                vals[i + 1].style.setProperty("height", node1val + "%");
                sorted = false;
            }

            await sleep(800);

            progressBar.style.setProperty(
                "width",
                (++comparisonsMade / totalComparisonsReq) * 100 + "%"
            );
            vals[i].classList.remove("compare");
            vals[i + 1].classList.remove("compare");
        }

        ++counter;
    }

}

async function quickSortWrapper() {

    async function swap(items, leftIndex, rightIndex) {
        let pivot = null;

        if (items[leftIndex].classList.contains("quick-pivot")) {
            pivot = leftIndex;
            items[leftIndex].classList.remove("quick-pivot");
        }

        if (items[rightIndex].classList.contains("quick-pivot")) {
            pivot = rightIndex;
            items[rightIndex].classList.remove("quick-pivot");
        }

        items[leftIndex].classList.add("compare");
        items[rightIndex].classList.add("compare");
        await sleep(500);

        const temp = parseInt(items[leftIndex].getAttribute("data-value"));
        items[leftIndex].setAttribute("data-value", parseInt(items[rightIndex].getAttribute("data-value")));
        items[leftIndex].style.setProperty("height", items[rightIndex].getAttribute("data-value") + "%");
        items[rightIndex].setAttribute("data-value", temp);
        items[rightIndex].style.setProperty("height", temp + "%");
        await sleep(300);

        items[leftIndex].classList.remove("compare");
        items[rightIndex].classList.remove("compare");

        if (pivot != null) {
            items[pivot].classList.add("quick-pivot");
        }

        return;
    }

    async function partition(items, left, right) {
        const pivot = items[Math.floor((right + left) / 2)];
        pivot.classList.add("quick-pivot");
        const pivotVal = parseInt(pivot.getAttribute("data-value"));
        let i = left,
            j = right;
        for (let i = left; i < right; ++i) {
            items[i].classList.add("partition");
        }
        while (i <= j) {

            while (parseInt(items[i].getAttribute("data-value")) < pivotVal) {
                ++i;
            }

            while (parseInt(items[j].getAttribute("data-value")) > pivotVal) {
                j--;
            }

            if (i <= j) {
                await swap(items, i, j);
                ++i;
                --j;
            }
        }
        for (let i = left; i < right; ++i) {
            items[i].classList.remove("partition");
        }
        pivot.classList.remove("quick-pivot");
        return i;
    }

    async function quickSort(items, left, right) {
        let pivot;

        if (items.length > 1) {
            pivot = await partition(items, left, right);
            if (left < pivot - 1) {
                await quickSort(items, left, pivot - 1);
            }

            if (pivot < right) {
                await quickSort(items, pivot, right);
            }

        }

        return items;
    }

    const vals = [...dataset.querySelectorAll(".data-item")];
    quickSort(vals, 0, vals.length - 1);
}

generateNumsButton.addEventListener("click", () => {
    createAndAppendNodes(generateNums());
});
sortButton.addEventListener("click", sort);
<script lang="ts">
  export let number: number;
</script>

{#if number !== undefined}
  <div
    style={`height: ${number * 3}px`}
    class="main-div"
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
  }
  .number {
    position: absolute;
    bottom: -20px;
    color: black;
  }
</style>

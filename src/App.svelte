<script lang="ts">
  import SortingContainer from "./components/SortingContainer.svelte";
  import { createForm } from "svelte-forms-lib";
  import mainStore from "./Stores";

  const { form, handleChange, handleSubmit } = createForm({
    initialValues: {
      numberOfValues: 10,
    },
    onSubmit: ({ numberOfValues }) => {
      mainStore.update((values) => {
        return {
          ...values,
          numbers: Array.from({ length: numberOfValues }).map(() =>
            Math.floor(Math.random() * 100)
          ),
        };
      });
    },
  });
</script>

<main>
  <SortingContainer />
  <div class="form-container">
    <form on:submit={handleSubmit}>
      <label for="numberOfValues">Number of Values to sort</label>
      <input
        id="numberOfValues"
        type="range"
        name="numberOfValues"
        min="5"
        max="20"
        on:change={handleChange}
        bind:value={$form.numberOfValues}
      />

      <button type="submit">
        Generate <strong>{$form.numberOfValues}</strong> values
      </button>
    </form>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 700px;
    margin: 0 auto;
  }
  form {
    display: flex;
    flex-direction: column;
    width: max-content;
    align-items: center;
    margin: 0 auto;
  }
  .form-container {
    width: 100%;
    padding: 40px 0;
  }
</style>

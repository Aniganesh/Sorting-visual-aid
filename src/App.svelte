<script lang="ts">
  import SortingContainer from "./components/SortingContainer.svelte";
  import { createForm } from "svelte-forms-lib";
  import mainStore from "./Stores";
  import "smelte/src/tailwind.css";
  import Button from "smelte/src/components/Button";
  const { form, handleChange, handleSubmit } = createForm({
    initialValues: {
      numberOfValues: 10,
    },
    onSubmit: ({ numberOfValues }) => {
      mainStore.setNumbers(
        Array.from({ length: numberOfValues }).map(() =>
          Math.floor(Math.random() * 100)
        )
      );
    },
  });
</script>

<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet"
/>
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
      <Button type="submit" color="primary">
        Generate <strong>{$form.numberOfValues}</strong> values
      </Button>
    </form>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 1000px;
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
  input[type="range"] {
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>

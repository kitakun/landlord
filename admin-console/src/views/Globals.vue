<template>
  <div class="home">
    <h2>Globals</h2>
    <Loader v-if="isBusy" />

    <ErrorBlock :errorData="lastError" />

    <table class="table">
      <tr>
        <td class="left-column">
          <div>
            <b>Create Database from zero</b>
          </div>
          <div>
            <small>run once on new servers</small>
          </div>
        </td>
        <td class="right-column">
          <button :disabled="isBusy" v-on:click="runCreateDbFromZero()" class="btn info">Run</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";
import Notifications from "vue-notification";
// Components
import Loader from "@/components/Loader.vue";
import ErrorBlock from "@/components/ErrorBlock.vue";
import { prepareUrl } from "../utils";

@Component({
  components: {
    Loader,
    ErrorBlock
  }
})
export default class GlobalsView extends Vue {
  isBusy: Boolean = false;
  lastError: any = null;

  clearErrors(): void {
    this.lastError = null;
  }

  runCreateDbFromZero(): void {
    this.isBusy = true;
    this.clearErrors();
    Axios({
      method: "POST",
      url: prepareUrl(`/ultra/createdb`)
    })
      .then(resp =>
        this.$notify({
          group: "main",
          title: "Result",
          text: "Database was successfully created!"
        })
      )
      .catch(err => (this.lastError = err))
      .finally(() => (this.isBusy = false));
  }
}
</script>

<style scoped>
.right-column {
  text-align: right;
  padding: 8px;
}
</style>

<template>
  <div class="new">
    <h1>Create New Space</h1>
    <h3 class="muted">Create entity in Database and project structure on server</h3>

    <ErrorBlock :errorData="lastError" />

    <table class="table">
      <tbody>
        <tr>
          <td class="left-column">
            <div>
              <b>Instance Name:</b>
            </div>
            <div>
              <small>Only for admins</small>
            </div>
          </td>

          <td class="right-column">
            <input type="text" maxlength="64" :disabled="isBusy" v-model="name" />
          </td>
        </tr>
        <tr>
          <td class="left-column">
            <div>
              <b>Port:</b>
            </div>
            <div>
              <small>Can be empty</small>
            </div>
          </td>

          <td class="right-column">
            <input type="number" maxlength="6" minlength="4" :disabled="isBusy" v-model="port" />
          </td>
        </tr>
        <tr>
          <td colspan="2" class="btn-column">
            <button class="btn info" :disabled="isBusy" v-on:click="createNewSpace()">create</button>
          </td>
        </tr>
      </tbody>
    </table>

    <Loader v-if="isBusy" />
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

  name: string = "";
  port: number | null = null;

  clearErrors(): void {
    this.lastError = null;
  }

  clearForm(): void {
    this.name = "";
    this.port = null;
  }

  validateInputs(): boolean {
    if (!this.name) {
      this.lastError = "Write name, please";
      return false;
    }

    if (this.name.length < 3) {
      this.lastError = "Better to have a longer name..";
      return false;
    }

    if (this.port && this.port < 999) {
      this.lastError =
        "Better have port more than 999, 3005 is good if it not taken already";
      return false;
    }

    this.clearErrors();

    return true;
  }

  createNewSpace(): void {
    if (!this.validateInputs()) return;
    this.isBusy = true;
    this.clearErrors();
    Axios.post(prepareUrl(`/ultra/createnew`), {
      name: this.name,
      port: this.port
    })
      .then(resp => {
        this.clearForm();
        this.$notify({
          group: "main",
          title: "Result",
          text: "Database was successfully created!"
        });
      })
      .catch(err => (this.lastError = err))
      .finally(() => (this.isBusy = false));
  }
}
</script>

<style scoped>
.btn-column {
  text-align: right;
  padding: 10px;
}
</style>
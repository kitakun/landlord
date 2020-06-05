<template>
  <div v-if="errorData" class="block">{{errorText}}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class ErrorBlockComponent extends Vue {
  @Prop()
  errorData: any = null;

  errorText: string = "";

  @Watch("errorData")
  onErrorChanged(newError: any): void {
    if (newError === null) {
      this.errorText = "";
    } else if (typeof newError === "string") {
      this.errorText = newError;
    } else if (newError.error) {
      this.errorText = newError.error;
    } else if (newError.response) {
      if (newError.response.data) {
        if (newError.response.data.error) {
          this.errorText = newError.response.data.error;
        } else {
          this.errorText = newError.response.data;
        }
      } else {
        this.errorText = newError.response;
      }
    } else if (newError.message) {
      this.errorText = newError.message;
    } else {
      this.errorText = "Unknown error has occured";
    }
  }
}
</script>

<style scoped>
.block {
  /* content in center */
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  /* styles */
  color: white;
  background-color: #ee6055;
  min-height: 140px;
  padding: 12px;
  margin: 12px;
  font-size: 32px;
}
</style>
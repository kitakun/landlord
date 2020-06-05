<template>
  <div class="hello">
    <h1>All existing Spaces:</h1>

    <div class="loader">
      <Loader v-if="isLoading" text="isLoading" />
    </div>

    <ErrorBlock :errorData="lastError" />

    <div class="spaces-list">
      <div class="space-element" v-for="item in loadedData" :key="item.Id">
        <div class="flex-row">
          <div class="flex-column">
            <span class="id-column">{{item.Id}}</span>
          </div>
          <div class="flex-column name-column">{{item.Name}}</div>
          <div class="flex-column">
            <span class="state-column">{{item.isEnabled ? 'Alive' : 'Disabled'}}</span>
          </div>
        </div>
        <div class="flex-row">
          <button
            class="btn success"
            v-on:click="enableSpace(item)"
            :disabled="!canEnableSpace(item)"
          >Enable</button>
          <button
            class="btn warning"
            v-on:click="disableSpace(item)"
            :disabled="!canDisableSpace(item)"
          >Disable</button>
        </div>
        <!-- <span>{{item.WebPort}}</span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
// Components
import Loader from "@/components/Loader.vue";
import ErrorBlock from "@/components/ErrorBlock.vue";
// Models
import { AdminExisgintSpace } from "../../../app/models/Admin.model";

@Component({
  components: {
    Loader,
    ErrorBlock
  }
})
export default class SpacesList extends Vue {
  loadedData: Array<AdminExisgintSpace> = [];
  isLoading: boolean = false;
  lastError: string | null = null;

  mounted() {
    this.isLoading = true;
    // load existing spaces
    this.reloadList();
  }

  canEnableSpace(item: AdminExisgintSpace): boolean {
    return !item.isEnabled && !this.isLoading;
  }

  enableSpace(item: AdminExisgintSpace): void {
    this.isLoading = true;
    axios({
      method: "GET",
      url: `http://127.0.0.1:3000/ultra/startlanding/${item.Name}`
    })
      .then(resp => this.reloadList())
      .catch((resp) => {
        this.lastError = resp;
        this.isLoading = false;
      });
  }

  canDisableSpace(item: AdminExisgintSpace): boolean {
    return item.isEnabled && !this.isLoading;
  }

  disableSpace(item: AdminExisgintSpace): void {
    this.isLoading = true;
    axios({
      method: "GET",
      url: `http://127.0.0.1:3000/ultra/stoplanding/${item.Name}`
    })
      .then(resp => this.reloadList())
      .catch(() => (this.isLoading = false));
  }

  private reloadList(): Promise<any> {
    return axios({
      method: "POST",
      url: "http://127.0.0.1:3000/ultra/getlist"
    })
      .then(resp => (this.loadedData = resp.data))
      .catch((resp) => {
        this.lastError = resp;
      })
      .finally(() => (this.isLoading = false));
  }
}
</script>

<style scoped>
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform: -webkit-translate(-50%, -50%);
  transform: -moz-translate(-50%, -50%);
  transform: -ms-translate(-50%, -50%);
  color: darkred;
}
.spaces-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.space-element {
  width: 250px;
  height: 80px;
  font-size: 22px;
  background-color: #aca7ad24;
  padding: 4px;
  margin: 4px;
  border-radius: 4px;
  -webkit-box-shadow: 0px 4px 5px 2px rgba(179, 179, 179, 1);
  -moz-box-shadow: 0px 4px 5px 2px rgba(179, 179, 179, 1);
  box-shadow: 0px 4px 5px 2px rgba(179, 179, 179, 1);
}
.id-column {
  text-align: left;
  padding: 4px;
  font-size: 14px;
  opacity: 0.6;
}
.name-column {
  text-align: center;
  flex: 3 3 0;
}
.state-column {
  text-align: right;
  padding: 4px;
  font-size: 14px;
  opacity: 0.6;
}
</style>

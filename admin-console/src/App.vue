<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/new">Create New</router-link>
    </div>

    <div class="app-content">
      <router-view />
    </div>
  </div>
</template>

<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: #dce3f146;
}

.app-content {
  max-width: 800px;
  background-color: #ffffff91;
  margin: 0 auto;
  padding: 10px;
  border-radius: 4px;
  /* shadow */
  -webkit-box-shadow: 0px 4px 5px 2px rgba(179, 179, 179, 1);
  -moz-box-shadow: 0px 4px 5px 2px rgba(179, 179, 179, 1);
  box-shadow: 0px 4px 5px 2px rgba(179, 179, 179, 1);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

/* Flex */

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.flex-column {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
}

/* Buttons */
.btn {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 6px 12px;
  font-size: 16px;
  cursor: pointer;
}

.btn[disabled="disabled"] {
  cursor: default;
  opacity: 0.5;
}

/* Green */
.success,
.success:hover[disabled="disabled"] {
  border-color: #4caf50;
  color: green;
  background: white;
}

.success:hover {
  background-color: #4caf50;
  color: white;
}

/* Blue */
.info,
.info:hover[disabled="disabled"] {
  border-color: #2196f3;
  color: dodgerblue;
  background: white;
}

.info:hover {
  background: #2196f3;
  color: white;
}

/* Orange */
.warning,
.warning:hover[disabled="disabled"] {
  border-color: #ff9800;
  color: orange;
  background: white;
}

.warning:hover {
  background: #ff9800;
  color: white;
}

/* Red */
.danger,
.danger:hover[disabled="disabled"] {
  border-color: #f44336;
  color: red;
}

.danger:hover {
  background: #f44336;
  color: white;
}

/* Gray */
.default,
.default:hover[disabled="disabled"] {
  border-color: #e7e7e7;
  color: black;
}

.default:hover {
  background: #e7e7e7;
}
</style>

<template>
  <v-container grid-list-md text-xs-center>
    <!-- Running Task -->
    <v-layout row v-if="this.isRunning">
      <v-flex xs12>
        <v-list>
          <v-list-tile>
            <v-list-tile-avatar>
              <v-icon :color="runningTask.project.color">folder</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ runningTask.description }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ runningTask.project.name }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{ runningTimer | secondsToTime }}</v-list-tile-action-text>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1" @click="stopTask">stop</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <!-- List of tasks -->
      <v-flex lg7 md6 xs12>
        <app-task v-for="task in tasks" :key="task._id" :task="task"></app-task>
      </v-flex>
      <!-- Last tasks -->
      <v-flex lg5 md6 xs12>
        <v-card white>Trabalhando nisso?</v-card>
      </v-flex>
    </v-layout>
    <app-new-task></app-new-task>
  </v-container>
</template>

<script>
import Task from "./Task.vue";
import NewTask from "./NewTask.vue";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      taskRunning: null,
      timer: null,
      isRunning: false
    };
  },
  computed: {
    tasks() {
      return this.$store.getters.tasksDone;
    },
    runningTask() {
      return this.taskRunning;
    },
    runningTimer() {
      return this.timer;
    }
  },
  filters: {
    secondsToTime: function(value) {
      let date = new Date(null);
      date.setSeconds(value); // specify value for SECONDS here
      const result = date.toISOString().substr(11, 8);
      return result;
    }
  },
  components: {
    appTask: Task,
    appNewTask: NewTask
  },
  methods: {
    ...mapActions(["loadTasks"]),
    runTask() {
      setInterval(() => {
        //console.log(this.isRunning);
        if (this.isRunning) {
          this.timer++;
        }
      }, 1000);
    },
    stopTask() {
      console.log(this.taskRunning._id);
      // stop
      axios
        .patch("/workspace/" + this.taskRunning._id + "/stop")
        .then(res => {
          if (res.status !== 200) {
            throw new Error("Falha ao pausar tarefa.");
          }
          this.isRunning = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    // Load running task
    axios
      .get("/workspace/5c58e119d5e2b359800929a1/running-task")
      .then(task => {
        if (task.status !== 200) {
          throw new Error("Falha ao obter tarefa em execução.");
        }
        this.taskRunning = task.data.task;
        this.timer = task.data.task.timer;
        this.isRunning = true;
        this.runTask();
      })
      .catch(err => {
        console.log(err);
      });
    // Load Tasks of User
    this.loadTasks();
  }
};
</script>


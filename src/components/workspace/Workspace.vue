<template>
  <v-container grid-list-md text-xs-center>
    <!-- Running Task -->
    <v-layout row v-if="taskRunning">
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
                <v-icon color="grey lighten-1">pause</v-icon>
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
      let hours = parseInt(Math.floor(value / 360));
      let minutes = parseInt(Math.floor((value - hours * 360) / 60));
      let seconds = parseInt((value - (hours * 360 + minutes * 60)) % 60);

      let dHours = hours > 9 ? hours : "0" + hours;
      let dMins = minutes > 9 ? minutes : "0" + minutes;
      let dSecs = seconds > 9 ? seconds : "0" + seconds;

      return dHours + ":" + dMins + ":" + dSecs;
    }
  },
  components: {
    appTask: Task,
    appNewTask: NewTask
  },
  methods: {
    ...mapActions(["loadTasks"]),
    runTask() {
      setInterval( () => {
        //console.log(this.isRunning);
        if (this.isRunning) {
          this.timer++;
        }
      }, 1000);
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
        this.taskRunning = task.data;
        this.timer = task.data.timer;
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


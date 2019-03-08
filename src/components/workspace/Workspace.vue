<template>
  <v-container grid-list-md text-xs-center>
    <!-- Running Task -->
    <v-layout row v-if="runningTask">
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
              <v-list-tile-action-text>{{ runningTask.timer | secondsToTime }}</v-list-tile-action-text>
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
        <div v-for="tasksGroup in tasks" :key="tasksGroup._id.date">
          <v-subheader>{{ tasksGroup._id.date }}</v-subheader>
          <app-task v-for="task in tasksGroup.finishedTasks" :key="task._id" :task="task"></app-task>
        </div>
      </v-flex>
      <!-- Last activities -->
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
      tasks: []
    };
  },
  computed: {
    finishedTasks() {
      return this.tasks;
    },
    runningTask() {
      return this.$store.getters.taskRunning;
    }
  },
  filters: {
    secondsToTime: function(value) {
      if (value < 1) {
        value = 1;
      }
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
    ...mapActions(["loadRunningTask"]),
    async stopTask() {
      //console.log(this.runningTask._id);
      try {
        // stop
        const result = await axios.patch(
          "/workspace/" + this.runningTask._id + "/stop"
        );
        if (result.status !== 200) {
          throw new Error("Falha ao pausar tarefa.");
        }
        this.$store.commit("stopTask");

        // load finished tasks
        const finishedTasks = await axios.get("/workspace/5c58e119d5e2b359800929a1/finished-tasks");
        if (finishedTasks.status !== 200) {
          throw new Error("Falha ao obter tarefas.");
        }
        this.tasks = finishedTasks.data;

      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    // Load running task
    this.loadRunningTask();

    // Load finished tasks
    axios
      .get("/workspace/5c58e119d5e2b359800929a1/finished-tasks")
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Falha ao obter tarefas.");
        }
        return res.data;
      })
      .then(resData => {
        console.log("FINISHED TASKS: ", resData);
        this.tasks = resData;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>


<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row>
      <v-flex xs12>
        <v-card white>Iniciar Tarefa / Mostrar tarefa em execucao</v-card>
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
import { mapActions } from 'vuex';

export default {
  computed: {
    tasks() {
      return this.$store.getters.tasksDone;
    }
  },
  components: {
    appTask: Task,
    appNewTask: NewTask
  },
  methods: {
    ...mapActions(["loadTasks"])
  },
  mounted () {
    //Load Tasks of User
    this.loadTasks();
  }
};
</script>


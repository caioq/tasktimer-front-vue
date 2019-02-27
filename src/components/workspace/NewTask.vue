<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-btn slot="activator" color="red" absolute fab top right dark>
      <v-icon>add</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Nova Tarefa</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="Descrição"
                required
                @input="$v.description.$touch()"
                :error-messages="descriptionErrors"
                v-model="description"
              ></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-combobox
                v-model="project"
                :items="projectsList"
                :search-input.sync="search"
                hide-selected
                hint="Apenas um projeto"
                label="Selecione um projeto"
                multiple
                persistent-hint
                small-chips
                required
                @input="$v.project.$touch()"
                :error-messages="projectErrors"
              >
                <template slot="no-data">
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        Nenhum resultado encontrado "
                        <strong>{{ search }}</strong>". Pressione
                        <kbd>enter</kbd> para criar um novo.
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-combobox>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="dialog = false">Fechar</v-btn>
        <v-btn color="blue darken-1" flat @click="saveTask">Iniciar Tarefa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapGetters } from 'vuex';
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      description: null,
      dialog: false,
      projectsList: [],
      project: [],
      search: null
    };
  },
  validations: {
    description: {
      required,
      maxLength: maxLength(50)
    },
    project: {
      required
    }
  },
  computed: {
    ...mapGetters(['taskRunning']),
    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.maxLength &&
        errors.push("Descrição deve ter no máximo 50 caracteres.");
      !this.$v.description.required && errors.push("Descrição é obrigatório.");
      return errors;
    },
    projectErrors() {
      const errors = [];
      if (!this.$v.project.$dirty) return errors;
      !this.$v.project.required && errors.push("Projeto é obrigatório.");
      return errors;
    }
  },
  watch: {
    project(val) {
      if (val.length > 1) {
        this.$nextTick(() => this.project.pop());
      }
    }
  },
  methods: {
    saveTask() {
      // Vuelidate
      this.$v.$touch();

      // check if already has running task
      if (this.taskRunning) {
        throw new Error("Já possui tarefa em andamento.");
      }
      // POST Method, save the new task
      axios
        .post("workspace/add-task", {
          description: this.description,
          project: this.project[0]
        })
        .then( res => {
          if(res.status !== 200) {
            throw new Error("Falha ao obter Projetos.");
          }          
          console.log("NEW TASK:", res);
          this.$store.commit('newRunningTask', res.data.result);
          // close dialog
          this.dialog = false;
        })
        .catch(err => {
          console.log(err);
        });
      
    }
  },
  mounted() {
    axios
      .get("/workspace/5c58e119d5e2b359800929a1/projects")
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Falha ao obter Projetos.");
        }
        return res.data;
      })
      .then(resData => {
        console.log("PROJECTS: ", resData);
        this.projectsList = resData.map(function(project) {
          return project.name;
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
</style>

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
              <v-text-field label="Descrição*" required></v-text-field>
            </v-flex>

            <v-flex x12>
              <v-combobox
                v-model="model"
                :items="projects"
                :search-input.sync="search"
                hide-selected
                hint="Apenas um projeto"
                label="Selecione um projeto"
                multiple
                persistent-hint
                small-chips
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
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      dialog: false,
      projects: [],
      model: [],
      search: null
    };
  },
  watch: {
    model(val) {
      console.log("MODEL:", val);
      if (val.length > 1) {
        this.$nextTick(() => this.model.pop());
      }
    }
  },
  mounted() {
    axios
      .get("http://localhost:3000/workspace/5c58e119d5e2b359800929a1/projects")
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Falha ao obter Projetos.");
        }
        return res.data;
      })
      .then(resData => {
        console.log("RESPOSTA", resData);
        this.projects = resData.map( function(project) {
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

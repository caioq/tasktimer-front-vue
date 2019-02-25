<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex lg7 md6 xs12>
        <v-card white>
          <v-card-text>
            <p class="text-md-left">Task Timer</p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex lg5 md6 xs12>
        <v-card white class="px-4">
            <v-card-title>
            <div class="title font-weight-light">
                Login
            </div>
            </v-card-title>
           
          <v-form>
            <v-container>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
            
            <v-card-actions>
          <v-btn @click="signin" color="success">Entrar</v-btn>
        </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        ...mapActions(["loadTasks"]),
        signin() {
            //TODO: realizar autenticacao com servidor

            //Go to Workspace
            this.$router.push('workspace');
        }
    }
};
</script>


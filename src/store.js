import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        tasks: [],
        user: null
    },
    getters: {
        tasksDone: (state) => {
            return state.tasks;
        }
    },
    mutations: {
        'LOAD_TASKS'(state) {
            axios.get('http://localhost:3000/workspace/5c58e119d5e2b359800929a1/tasks')
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error('Falha ao obter tarefas.')
                    }
                    return res.data;
                })
                .then(resData => {
                    console.log("RESPOSTA",resData);
                    state.tasks = resData;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    actions: {
        loadTasks: ({ commit }) => {
            commit('LOAD_TASKS');
        }
    }
})
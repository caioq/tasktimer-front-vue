import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        tasks: [],
        task: null,
        user: null
    },
    getters: {
        tasksDone: (state) => {
            return state.tasks;
        },
        taskRunning: (state) => {
            return state.task;
        }
    },
    mutations: {
        'LOAD_TASKS'(state) {
            axios.get('/workspace/5c58e119d5e2b359800929a1/finished-tasks')
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error('Falha ao obter tarefas.')
                    }
                    return res.data;
                })
                .then(resData => {
                    console.log("RESPOSTA", resData);
                    state.tasks = resData;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        'LOAD_RUNNING_TASK'(state) {
            axios.get('/workspace/5c58e119d5e2b359800929a1/running-task')
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error('Falha ao obter tarefas em andamento.')
                    }
                    return res.data;
                })
                .then(resData => {
                    //console.log("RESPOSTA",resData);
                    state.task = resData.task;
                    const timerInterval = setInterval(() => {
                        if (state.task) {
                            state.task.timer++;
                        } else {
                            clearInterval(timerInterval);
                        }
                    }, 1000);
                    //return state.task;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        stopTask(state) {
            state.task = null;
        },
        newRunningTask(state, payload) {
            state.task = payload;
        }
    },
    actions: {
        loadTasks: ({ commit }) => {
            commit('LOAD_TASKS');
        },
        loadRunningTask: ({ commit }) => {
            commit('LOAD_RUNNING_TASK');
        }
    }
})
<template>
  <v-card white>
    <v-card-text>
      <v-icon left :color="task.project.color">folder</v-icon>
      <span class="title font-weight-light">{{ task.description }}</span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    props: ["task"]
};
</script>


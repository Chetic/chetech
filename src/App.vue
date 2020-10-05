<template>
  <v-app>
    <v-main>
      <v-app-bar flat>
        <v-tabs fixed-tabs>
          <v-tab>About</v-tab>
          <v-tab>Projects</v-tab>
          <v-tab>Contact</v-tab>
          <v-tab-item class="pt-16">
            <AboutPage class="pt-16"/>
          </v-tab-item>
          <v-tab-item class="pt-16">
            <ProjectsPage class="pt-16"/>
          </v-tab-item>
          <v-tab-item class="pt-16">
            <ContactPage class="pt-16"/>
          </v-tab-item>
        </v-tabs>
      </v-app-bar>
      <v-container>
        <v-img
          :src="require('./assets/chetech_colorontransparent.png')"
          contain
          max-height="200"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import AboutPage from './components/AboutPage.vue'
import ProjectsPage from './components/ProjectsPage.vue'
import ContactPage from './components/ContactPage.vue'

export default Vue.extend({
  name: 'App',

  components: {
    AboutPage,
    ProjectsPage,
    ContactPage
  },

  data: () => ({
    //
  })
})
</script>

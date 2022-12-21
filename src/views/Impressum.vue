<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" height="100%" flat tile>
    <v-card-title>{{ $t('about.impressumTitle')}}</v-card-title>
              <v-card-text class="pt-4 pb-2 mb-0 mt-0">
                <v-btn small :color="colortheme.color" :href="impressumURL" target="_blank">{{$t('about.impressumprivacyTitle')}}</v-btn>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'Impressum',
  data: () => ({
    impressumURL: 'http://www.snsb.info/Impressum.html'
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    }
  }
}
</script>

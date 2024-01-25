<template>
<v-card flat :color="colortheme.color">
    <v-window v-if="carouselImages && carouselImages.length > 0" v-model="onboarding">
      <v-window-item v-for="(img,i) in carouselImages" style="height:400px"
       :key="i" class="ma-4">
        <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
        <v-img v-if="img && img.URL" class="custom-img" contain :src="img.URL" :alt="img.URL" v-on:error="img.URL=require('../assets/ImageLoadError.jpg')">
        </v-img>
        <v-card-text class="subtitle-2 transparent grey--text text-right">{{img.Rights}} <br> {{img.License}}
          </v-card-text>
        </v-row>
      </v-window-item>
    </v-window>
    <v-card-actions class="justify-space-between">
      <v-btn
        variant="text"
        @click="prev"
      >
        <v-icon v-if="carouselImages && carouselImages.length > 1">mdi-chevron-left</v-icon>
      </v-btn>
      <v-item-group
        v-model="onboarding"
        class="text-center"
        mandatory
      >
        <v-item
          v-for="n in carouselImages.length"
          :key="`btn-${n}`"
          v-slot="{ active, toggle }"
        >
          <v-btn
            :input-value="active"
            icon
            @click="toggle"
          >
            <v-icon>mdi-record</v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
      <v-btn
        text
        @click="next"
      >
        <v-icon v-if="carouselImages && carouselImages.length > 1">mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
    </v-card>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DivNaviKeyImageCarousel',
  props: [ 'carouselImages' ],
  data: () => ({
    onboarding: 0
  }),
  computed: {
    ...mapGetters(['getGuiColorTheme']),
    colortheme () {
      return this.getGuiColorTheme
    },
    carouselHeight () {
      if (this.carouselImages && this.carouselImages.length > 0) {
        return 'auto'
      } else {
        return '1%'
      }
    },
    isMobile () {
      return this.$vuetify.display.xsOnly
    }
  },
  methods: {
    resetOnboarding () {
      this.onboarding = 0
    },
    next () {
      this.onboarding = this.onboarding + 1 === this.carouselImages.length
        ? 0
        : this.onboarding + 1
    },
    prev () {
      this.onboarding = this.onboarding - 1 < 0
        ? this.carouselImages.length - 1
        : this.onboarding - 1
    }
  }
}
</script>
<style scoped>
.wrap-text {
  -webkit-line-clamp: unset !important;
  white-space: normal;
}
.box {
  position: relative;
}
img {
  width: auto;
  height: 100%;
  opacity: 0.6;
}
.custom-img {
    max-height:500px;
    max-width:500px;
    height:80%;
}
.direction {
  position: absolute;
  bottom: 10px;
  right: 19px;
  font-size: 13px;
}
</style>

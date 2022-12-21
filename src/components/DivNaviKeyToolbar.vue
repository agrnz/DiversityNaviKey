<template>
<v-toolbar :color="toolbarcolor" dense flat>
   <!-- <template v-slot:img="{ props }">
        <v-img v-bind="props">
        </v-img>
      </template> -->
      <template>
        <slot name="content"></slot>
      </template>
      <template>
        <slot name="menu"></slot>
      </template>
</v-toolbar>
</template>
<script>
export default {
  name: 'DivNaviKeyToolbar',
  data: () => ({
  }),
  computed: {
    toolbarcolor () {
      return this.$store.getters.getGuiColorTheme.toolbarcolor
    }
  }
}
</script>

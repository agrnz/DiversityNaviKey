<template>
  <v-card :color="colortheme.color">
        <v-card-title>{{ $t('exportDialogForm.saveDialogExportTitle') }}</v-card-title>
        <v-card-text>
          <v-text-field :label="$t('exportDialogForm.fileName')" clearable type="text" v-model="exportFileName"></v-text-field>
          <v-btn text :color="colortheme.colortext" @click="onOKExportButtonClick()">{{ $t('exportDialogForm.okExportButton' )}}</v-btn>
          <v-btn text :color="colortheme.colortext" @click="onCancelExportButtonClick()">{{ $t('exportDialogForm.cancelExportButton') }}</v-btn>
        </v-card-text>
      </v-card>
</template>
<script>

export default {
  name: 'ExportDialogForm',
  data: () => ({
    exportDialog: false,
    exportFileName: ''
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    }
  },
  methods: {
    onOKExportButtonClick () {
      if (this.exportFileName && this.exportFileName !== '') {
        this.$emit('onOKExportButtonClick', this.exportFileName)
      }
    },
    onCancelExportButtonClick () {
      this.$emit('onCancelExportButtonClick')
    }
  }
}
</script>

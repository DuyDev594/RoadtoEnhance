<template>
  <div id="editorjs" class="border rounded-lg p-4 bg-white"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"

import EditorJS from "@editorjs/editorjs"

import Header from "@editorjs/header"
import List from "@editorjs/list"
import Paragraph from "@editorjs/paragraph"
import Quote from "@editorjs/quote"
import Code from "@editorjs/code"
import Table from "@editorjs/table"

import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"
import LinkTool from "@editorjs/link"

import ColorPlugin from "editorjs-text-color-plugin"
import AlignmentTuneTool from "editorjs-text-alignment-blocktune"

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
})

let editor = null

onMounted(() => {

  editor = new EditorJS({

    holder: "editorjs",

    placeholder: "Write grammar explanation here...",

    autofocus: true,

    data: props.modelValue || {},

    tools: {
      

      header: {
        class: Header,
        inlineToolbar: true,
        tunes: ["alignmentTune"]
      },

      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        tunes: ["alignmentTune"]
      },

      list: {
        class: List,
        inlineToolbar: true
      },

      quote: {
        class: Quote,
        inlineToolbar: true
      },

      code: {
        class: Code
      },

      table: {
        class: Table,
        inlineToolbar: true
      },

      marker: {
        class: Marker
      },

      inlineCode: {
        class: InlineCode
      },

      linkTool: {
        class: LinkTool
      },

      Color: {
        class: ColorPlugin,
        config: {
          colorCollections: [
            "#FF1300",
            "#EC7878",
            "#9C27B0",
            "#673AB7",
            "#3F51B5",
            "#0070FF",
            "#03A9F4",
            "#00BCD4",
            "#4CAF50",
            "#000000",
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFA500"
          ],
          defaultColor: "#0070FF",
          type: "text"
        }
      },

      alignmentTune: {
        class: AlignmentTuneTool
      }

    }

  })

})

onBeforeUnmount(async () => {

  if (editor && editor.destroy) {
    await editor.destroy()
    editor = null
  }

})

const saveContent = async () => {

  if (!editor) return null

  try {
    const output = await editor.save()
    return output
  } catch (error) {
    console.error("EditorJS save error:", error)
    return null
  }

}

defineExpose({
  saveContent
})
</script>
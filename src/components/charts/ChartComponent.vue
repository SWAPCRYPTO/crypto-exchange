<template>
  <LineChart v-if="data" :chartData="state.chartData" :chartOptions="state.chartOptions" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from 'vue'
import LineChart from './chart'
import 'chartjs-plugin-datalabels';

export default defineComponent({
  name: 'ChartComponent',
  components: { LineChart },
  props: {
      symbol: {
        type: String,
        required: true
      },
      data: {
        type: Object,
        required: true,
      },
      currency: {
        type: String,
        required: true
      }
  },
  setup(props) {
    const state = reactive({
      chartData: props.data,
      chartOptions: {
        responsive: true,
        scales: {
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          elements: {
            point: {
                radius: 0
            }
          },
        },
        legend: {
            display: false,
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: {
              weight: 'bold'
            }
          }
        }
      },
    })

    const primaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary')
    const fillData = () => {
      state.chartData = {
        labels: props.data.map(() => ''),
        datasets: [
          {
            label: props.symbol.toUpperCase(),
            lineTension: 0,
            fill: false,
            borderColor: primaryColor,
            data: props.data,
            pointRadius: 0
          }
        ]
      }
    }

    onBeforeMount(() => {
      fillData()
    })

    return { state }
  }
})
</script>
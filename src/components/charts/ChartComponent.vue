<template>
    <div class="w-full h-auto">
        <vue3-chart-js ref="chartRef" v-bind="{ ...lineChart }" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import dataLabels from "chartjs-plugin-datalabels";


export default defineComponent({
    name: "ChartComponent",
    components: {
        Vue3ChartJs
    },
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
      const primaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary')
      const textColor = ref(window.matchMedia("(prefers-color-scheme: dark)").matches ? 'white' : 'black')
      const chartRef = ref(null)

      const dataSet = ref(Object.values(props.data))
      const max = ref(Math.max(...dataSet.value))
      const min = ref(Math.min(...dataSet.value))

      const lineChart = {
        id: "line",
        type: "line",
        plugins: [dataLabels],
        data: {
          labels: props.data.map(() => ''),
          datasets: [
            {
              label: props.symbol?.toUpperCase(),
              lineTension: 0,
              fill: false,
              borderColor: primaryColor,
              data: props.data,
              pointRadius: 0
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              display: false
            },
            datalabels: {
              font: {
                size: 14
              },
              color: textColor.value,
              padding: 4,
              formatter: (value: number) =>
                  (value == min.value || value == max.value) ? `${value.toFixed(4)}` : ""
            },
          },
          scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
          },
          responsive: true
        },
      };

      return {
        chartRef,
        lineChart,
      };
    },
})
</script>

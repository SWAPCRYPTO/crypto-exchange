<template>
    <div class="w-full h-auto">
        <vue3-chart-js ref="chartRef" v-bind="{ ...lineChart }" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs"
import dataLabels from "chartjs-plugin-datalabels"
import { useStore } from 'vuex'


export default defineComponent({
    name: "ChartComponent",
    components: {
        Vue3ChartJs, 
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
      const store = useStore()
      const preferredCurrency = computed(() => store.getters.preferredCurrency)
      const primaryColor = ref(window.getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary'))
      const textColor = ref(window.getComputedStyle(document.documentElement).getPropertyValue('--ion-color-light'))
      const chartRef = ref(null)

      // update chart in route symbol is changed
      // onIonViewWillEnter(() => {
      //   if(route.params.symbol !== props.symbol) {
      //     asset.value = store.getters.asset(route.params.symbol)
      //   }
      // })

      const dataSet = ref(Object.values(props.data))    
      const max = Math.max(...dataSet.value)
      const min = Math.min(...dataSet.value)
      const lineChart = ref({
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
              borderColor: primaryColor.value,
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
                  (value == min || value == max) ? `${preferredCurrency.value} ${value.toFixed(4)}` : ""
            },
          },
          layout: {
            padding: 10
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
      });

      watch(() => props.data, newData => {
        dataSet.value = Object.values(newData)
        const max = Math.max(...dataSet.value)
        const min = Math.min(...dataSet.value)

        lineChart.value.data.datasets[0].data = newData
        lineChart.value.data.labels = newData.map(() => "")
        lineChart.value.options.plugins.datalabels.formatter = (value: number) => 
                  (value == min || value == max) ? `${preferredCurrency.value} ${value.toFixed(4)}` : ""

        if(chartRef.value)
            (chartRef.value as any).update()
      })

      return {
        chartRef,
        lineChart,
        min,
        max
      };
    },
})
</script>

<template>
    <div class="w-full h-auto">
        <vue3-chart-js ref="chartRef" v-bind="{ ...lineChart }" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from 'vue'
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs"
import dataLabels from "chartjs-plugin-datalabels"
import { useStore } from 'vuex'
import { displayOnlySignificatDigits } from '@/services/FormatValue'
import { convertCurrency } from '@/services/ConvertCurrency'
import { Currencies } from '@/store/modules/assets/models/NBPCurrency'


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
      },
      displayAllLabels: {
        type: Boolean,
        required: true
      }
    },
    setup(props) {
      const store = useStore()
      const preferredCurrency = computed(() => store.getters.preferredCurrency)
      const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
      const currencyRate = computed(() => preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1)
      const baseCurrencyRate = computed(() => store.getters.baseCurrencyRate)
      
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
              pointRadius: 1 // 2
            },
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
              clamp: true,
              color: textColor.value,
              padding: 4,
              display: (context: any) => props.displayAllLabels ? true : context.dataIndex == 0 || context.dataIndex == props.data.length - 1,
              formatter: (value: number) => 
                  (value == min || value == max) ? `${preferredCurrency.value} ${displayOnlySignificatDigits(convertCurrency(value, baseCurrencyRate.value, currencyRate.value), 6)}` : ""
            },
          },
          layout: {
            padding: {
              left: !props.displayAllLabels ? 50 : 10,
              right: !props.displayAllLabels ? 50 : 10,
              top: 10,
              bottom: 10
            }
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
                  (value == min || value == max) ? `${preferredCurrency.value} ${displayOnlySignificatDigits(convertCurrency(value, baseCurrencyRate.value, currencyRate.value), 6)}` : ""

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

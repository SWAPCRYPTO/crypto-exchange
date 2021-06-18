<template>
    <div class="w-full h-60 max-h-60">
        <vue3-chart-js ref="chartRef" v-bind="{ ...lineChart }" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs"
import dataLabels from "chartjs-plugin-datalabels"
import { formatValue } from '@/services/FormatValue'
import { convertCurrency } from '@/services/ConvertCurrency'
import useCurrency from '@/hooks/useCurrency'

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
      const { preferredCurrency, currencyRate, baseCurrencyRate } = useCurrency()
      
      const primaryColor = ref(window.getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary'))
      const textColor = ref(window.getComputedStyle(document.documentElement).getPropertyValue('--ion-color-light'))
      const chartRef = ref(null)

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
              label: preferredCurrency.value.toUpperCase(),
              lineTension: 0,
              fill: false,
              borderColor: primaryColor.value,
              data: props.data,
              pointRadius: 1
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
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
              formatter: (value: number) => {
                const convertedValue = convertCurrency(value, baseCurrencyRate.value, currencyRate.value)
                return (value == min || value == max) ? `${preferredCurrency.value} ${formatValue(convertedValue)}` : ""
              }  
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                      return `${context.dataset.label} ${formatValue(convertCurrency(context.raw, baseCurrencyRate.value, currencyRate.value))}`
                    },
                    labelColor: () => ({
                      backgroundColor: primaryColor.value,
                    }),
                    labelTextColor: () => textColor.value
                }
            }
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
                  (value == min || value == max) ? `${preferredCurrency.value} ${formatValue(convertCurrency(value, baseCurrencyRate.value, currencyRate.value))}` : ""

        if(chartRef.value)
            (chartRef.value as any).update()
      })

      const updateChartColors = (e: MediaQueryListEvent) => {
          const newColorScheme = e.matches ? "dark" : "light";
          lineChart.value.data.datasets[0].borderColor = newColorScheme == 'dark' ? '#d0b1fd' : '#893dfa'
          lineChart.value.options.plugins.datalabels.color = newColorScheme == 'dark' ? '#ffffff' : '#000'
          
          if(chartRef.value)
            (chartRef.value as any).update()
      }

      onMounted(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateChartColors)
      })

      onUnmounted(() => {
        window.removeEventListener('change', e => { console.log(e) })
      })

      return {
        chartRef,
        lineChart,
        min,
        max,
        primaryColor,
        textColor
      };
    },
})
</script>

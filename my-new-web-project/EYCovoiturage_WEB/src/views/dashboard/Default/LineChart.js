import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const chartData = [
    {
      "id": "japan",
      "color": "hsl(202, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 93
        },
        {
          "x": "helicopter",
          "y": 196
        },
        {
          "x": "boat",
          "y": 118
        },
        {
          "x": "train",
          "y": 218
        },
        {
          "x": "subway",
          "y": 62
        },
        {
          "x": "bus",
          "y": 133
        },
        {
          "x": "car",
          "y": 210
        },
        {
          "x": "moto",
          "y": 158
        },
        {
          "x": "bicycle",
          "y": 180
        },
        {
          "x": "horse",
          "y": 289
        },
        {
          "x": "skateboard",
          "y": 89
        },
        {
          "x": "others",
          "y": 129
        }
      ]
    },
    // {
    //   "id": "france",
    //   "color": "hsl(158, 70%, 50%)",
    //   "data": [
    //     {
    //       "x": "plane",
    //       "y": 91
    //     },
    //     {
    //       "x": "helicopter",
    //       "y": 32
    //     },
    //     {
    //       "x": "boat",
    //       "y": 39
    //     },
    //     {
    //       "x": "train",
    //       "y": 125
    //     },
    //     {
    //       "x": "subway",
    //       "y": 235
    //     },
    //     {
    //       "x": "bus",
    //       "y": 299
    //     },
    //     {
    //       "x": "car",
    //       "y": 49
    //     },
    //     {
    //       "x": "moto",
    //       "y": 188
    //     },
    //     {
    //       "x": "bicycle",
    //       "y": 13
    //     },
    //     {
    //       "x": "horse",
    //       "y": 230
    //     },
    //     {
    //       "x": "skateboard",
    //       "y": 213
    //     },
    //     {
    //       "x": "others",
    //       "y": 127
    //     }
    //   ]
    // },
    // {
    //   "id": "us",
    //   "color": "hsl(277, 70%, 50%)",
    //   "data": [
    //     {
    //       "x": "plane",
    //       "y": 97
    //     },
    //     {
    //       "x": "helicopter",
    //       "y": 263
    //     },
    //     {
    //       "x": "boat",
    //       "y": 204
    //     },
    //     {
    //       "x": "train",
    //       "y": 218
    //     },
    //     {
    //       "x": "subway",
    //       "y": 138
    //     },
    //     {
    //       "x": "bus",
    //       "y": 263
    //     },
    //     {
    //       "x": "car",
    //       "y": 98
    //     },
    //     {
    //       "x": "moto",
    //       "y": 236
    //     },
    //     {
    //       "x": "bicycle",
    //       "y": 213
    //     },
    //     {
    //       "x": "horse",
    //       "y": 279
    //     },
    //     {
    //       "x": "skateboard",
    //       "y": 192
    //     },
    //     {
    //       "x": "others",
    //       "y": 77
    //     }
    //   ]
    // },
    // {
    //   "id": "germany",
    //   "color": "hsl(14, 70%, 50%)",
    //   "data": [
    //     {
    //       "x": "plane",
    //       "y": 137
    //     },
    //     {
    //       "x": "helicopter",
    //       "y": 72
    //     },
    //     {
    //       "x": "boat",
    //       "y": 115
    //     },
    //     {
    //       "x": "train",
    //       "y": 294
    //     },
    //     {
    //       "x": "subway",
    //       "y": 134
    //     },
    //     {
    //       "x": "bus",
    //       "y": 79
    //     },
    //     {
    //       "x": "car",
    //       "y": 299
    //     },
    //     {
    //       "x": "moto",
    //       "y": 142
    //     },
    //     {
    //       "x": "bicycle",
    //       "y": 130
    //     },
    //     {
    //       "x": "horse",
    //       "y": 180
    //     },
    //     {
    //       "x": "skateboard",
    //       "y": 204
    //     },
    //     {
    //       "x": "others",
    //       "y": 210
    //     }
    //   ]
    // },
    // {
    //   "id": "norway",
    //   "color": "hsl(172, 70%, 50%)",
    //   "data": [
    //     {
    //       "x": "plane",
    //       "y": 128
    //     },
    //     {
    //       "x": "helicopter",
    //       "y": 119
    //     },
    //     {
    //       "x": "boat",
    //       "y": 123
    //     },
    //     {
    //       "x": "train",
    //       "y": 240
    //     },
    //     {
    //       "x": "subway",
    //       "y": 244
    //     },
    //     {
    //       "x": "bus",
    //       "y": 161
    //     },
    //     {
    //       "x": "car",
    //       "y": 219
    //     },
    //     {
    //       "x": "moto",
    //       "y": 279
    //     },
    //     {
    //       "x": "bicycle",
    //       "y": 229
    //     },
    //     {
    //       "x": "horse",
    //       "y": 221
    //     },
    //     {
    //       "x": "skateboard",
    //       "y": 126
    //     },
    //     {
    //       "x": "others",
    //       "y": 119
    //     }
    //   ]
    // }
  ]


const NivoLineChart = ({ data /* see data tab */,xLegend,yLegend }) => (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 80, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: xLegend,
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: yLegend,
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        lineWidth={4}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={4}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-17}
        useMesh={true}
        legends={[]}
    />
)

export default NivoLineChart
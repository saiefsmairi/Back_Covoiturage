// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBar } from '@nivo/bar'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const NivoBarChart = ({ data /* see data tab */ }) => (
    <ResponsiveBar
        data={data}
        keys={[
            'hot dog',
            'burger',
            'sandwich',
            'kebab',
            'fries',
            'donut'
        ]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
    />
)
export default NivoBarChart

// dataaaa example 
// const barChartDataEx = [
//     {
//       "country": "AD",
//       "hot dog": 126,
//       "hot dogColor": "hsl(230, 70%, 50%)",
//       "burger": 178,
//       "burgerColor": "hsl(193, 70%, 50%)",
//       "sandwich": 153,
//       "sandwichColor": "hsl(351, 70%, 50%)",
//       "kebab": 112,
//       "kebabColor": "hsl(72, 70%, 50%)",
//       "fries": 67,
//       "friesColor": "hsl(55, 70%, 50%)",
//       "donut": 145,
//       "donutColor": "hsl(323, 70%, 50%)"
//     },
//     {
//       "country": "AE",
//       "hot dog": 188,
//       "hot dogColor": "hsl(186, 70%, 50%)",
//       "burger": 3,
//       "burgerColor": "hsl(246, 70%, 50%)",
//       "sandwich": 78,
//       "sandwichColor": "hsl(134, 70%, 50%)",
//       "kebab": 78,
//       "kebabColor": "hsl(107, 70%, 50%)",
//       "fries": 75,
//       "friesColor": "hsl(83, 70%, 50%)",
//       "donut": 182,
//       "donutColor": "hsl(322, 70%, 50%)"
//     },
//     {
//       "country": "AF",
//       "hot dog": 73,
//       "hot dogColor": "hsl(271, 70%, 50%)",
//       "burger": 98,
//       "burgerColor": "hsl(298, 70%, 50%)",
//       "sandwich": 196,
//       "sandwichColor": "hsl(359, 70%, 50%)",
//       "kebab": 53,
//       "kebabColor": "hsl(149, 70%, 50%)",
//       "fries": 98,
//       "friesColor": "hsl(59, 70%, 50%)",
//       "donut": 75,
//       "donutColor": "hsl(51, 70%, 50%)"
//     },
//     {
//       "country": "AG",
//       "hot dog": 132,
//       "hot dogColor": "hsl(221, 70%, 50%)",
//       "burger": 179,
//       "burgerColor": "hsl(333, 70%, 50%)",
//       "sandwich": 38,
//       "sandwichColor": "hsl(175, 70%, 50%)",
//       "kebab": 11,
//       "kebabColor": "hsl(63, 70%, 50%)",
//       "fries": 92,
//       "friesColor": "hsl(239, 70%, 50%)",
//       "donut": 140,
//       "donutColor": "hsl(340, 70%, 50%)"
//     },
//     {
//       "country": "AI",
//       "hot dog": 86,
//       "hot dogColor": "hsl(159, 70%, 50%)",
//       "burger": 80,
//       "burgerColor": "hsl(333, 70%, 50%)",
//       "sandwich": 42,
//       "sandwichColor": "hsl(222, 70%, 50%)",
//       "kebab": 73,
//       "kebabColor": "hsl(220, 70%, 50%)",
//       "fries": 113,
//       "friesColor": "hsl(264, 70%, 50%)",
//       "donut": 109,
//       "donutColor": "hsl(312, 70%, 50%)"
//     },
//     {
//       "country": "AL",
//       "hot dog": 76,
//       "hot dogColor": "hsl(207, 70%, 50%)",
//       "burger": 25,
//       "burgerColor": "hsl(252, 70%, 50%)",
//       "sandwich": 120,
//       "sandwichColor": "hsl(18, 70%, 50%)",
//       "kebab": 149,
//       "kebabColor": "hsl(95, 70%, 50%)",
//       "fries": 121,
//       "friesColor": "hsl(20, 70%, 50%)",
//       "donut": 123,
//       "donutColor": "hsl(217, 70%, 50%)"
//     },
//     {
//       "country": "AM",
//       "hot dog": 10,
//       "hot dogColor": "hsl(210, 70%, 50%)",
//       "burger": 119,
//       "burgerColor": "hsl(111, 70%, 50%)",
//       "sandwich": 139,
//       "sandwichColor": "hsl(161, 70%, 50%)",
//       "kebab": 57,
//       "kebabColor": "hsl(20, 70%, 50%)",
//       "fries": 72,
//       "friesColor": "hsl(36, 70%, 50%)",
//       "donut": 121,
//       "donutColor": "hsl(126, 70%, 50%)"
//     }
//   ]
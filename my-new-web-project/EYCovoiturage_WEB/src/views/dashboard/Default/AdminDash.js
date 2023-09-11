import useGetDriverData from 'hooks/useGetDriverData'
import React from 'react'
import { divIcon } from 'leaflet'
import NivoBarChart from './BarChart'
import NivoArcChart from './ArcChart'

import { useEffect, useState } from 'react';

// material-ui
import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import useGetPassengersData from 'hooks/useGetPassengersData'
import chartData from './chart-data/bajaj-area-chart'
import { getData } from './chart-data/total-growth-bar-chart'
import MainCard from 'ui-component/cards/MainCard'
import useGetPointsData from 'hooks/useGetPointsData'
import useGetWeeklyData from 'hooks/useGetWeeklyData'
import NivoLineChart from './LineChart'


const driverStatsMode = [
    { key: 0, value: 'Number of Trips' },
    { key: 1, value: 'Total Trips Distance' },
    { key: 2, value: 'Total Trips Canceled' },
    { key: 3, value: 'Total Trips Points' },
]

const AdminDash = () => {
    const [pointsTop, setPointsTop] = useState(5)
    const [pointsTopMode, setPointsTopMode] = useState('start')
    const [driverTop, setDriverTop] = useState(5)
    const [driverDataMode, setDriverDataMode] = useState(driverStatsMode[0].key)
    const [passengersTop, setPassengersTop] = useState(5)
    const [passengersMode, setPassengersMode] = useState('success')
    const { mostTripsPoints, mostTripsDistance, mostTripsNumber, mostTripsCanceled } = useGetDriverData(driverTop)
    const { mostTripsCanceledPassenger, mostTripsPointsPassenger } = useGetPassengersData(passengersTop)
    const { finishingPoints, statingPoints } = useGetPointsData(pointsTop)
    const { dailyData, weeklyData } = useGetWeeklyData()
    const [dailyWeeklyMode,setDailyWeeklyMode] = useState('day')
    //    passenger data handler
    const dataPassenger = (mode) => {
        let data = []

        if (mode === "success") {
            data = mostTripsPointsPassenger?.map((item, idx) => {
                return {
                    id: item.user?.firstName,
                    label: item.user?.firstName,
                    value: item.tripsPoints,
                    color: "hsl(178, 70%, 50%)"
                }
            })
        } else {
            data = mostTripsCanceledPassenger?.map((item, idx) => {
                return {
                    id: item.user?.firstName,
                    label: item.user?.firstName,
                    value: item.ridesRequestsCount,
                    color: "hsl(178, 70%, 50%)"
                }
            })
        }
        return data
    }
    // flatten data 
    const flattenData = (arr, property) => {
        let category = []
        let xAxis = []
        for (let el of arr) {
            category.push(el?.user?.firstName)
            xAxis.push(el[property])
        }
        return {
            category, xAxis
        }
    }

    // driver data handler
    const switchData = () => {
        let data;
        switch (driverDataMode) {
            case 0:
                data = getData(flattenData(mostTripsNumber, 'tripsCount')?.category, flattenData(mostTripsNumber, 'tripsCount').xAxis, 'trips number')
                break;
            case 1:
                data = getData(flattenData(mostTripsCanceledPassenger, 'tripsTotalDistance')?.category, flattenData(mostTripsDistance, 'tripsTotalDistance').xAxis, 'trips number')
                break;
            case 2:
                data = getData(flattenData(mostTripsCanceled, 'tripsCount')?.category, flattenData(mostTripsCanceled, 'tripsCount').xAxis, 'trips number')
                break;
            case 3:
                data = getData(flattenData(mostTripsPoints, 'tripsPoints')?.category, flattenData(mostTripsPoints, 'tripsPoints').xAxis, 'trips number')
                break;
        }
        return data
    }
    // points data handler
    const pointsData = () => {
        let data
        if (pointsTopMode === 'start') {
            data = statingPoints
        } else { data = finishingPoints }

        return data?.map((item, idx) => ({
            id: item?.name,
            label: item?.name,
            value: item?.tripsCount
        }))
    }

    const serializeData = (arr,property)=>{
        const data = []
        for (let el of arr){
            data.push({x:el[property],y:el.tripsCount})
        }
        return[{
            id:property,
            color:"hsl(202, 70%, 50%)",
            data
        }]
    } 
    console.log(serializeData(weeklyData,'week'))

    return (
        <Grid container spacing={gridSpacing} sx={{ pt: 5 }}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <MainCard>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20 }}>
                                <Typography>
                                    Driver stats
                                </Typography>

                                <TextField
                                    id="standard-select-currency"
                                    select
                                    value={driverDataMode}
                                    onChange={(e) => setDriverDataMode(e.target.value)}
                                >
                                    {driverStatsMode.map((option) => (
                                        <MenuItem key={option.value} value={option.key}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </TextField >
                                <TextField
                                    id="standard-select-currency"
                                    select
                                    value={driverTop}
                                    onChange={(e) => setDriverTop(e.target.value)}
                                >
                                    <MenuItem value={2}>
                                        2
                                    </MenuItem>
                                    <MenuItem value={5}>
                                        5
                                    </MenuItem>
                                    <MenuItem value={7}>
                                        7
                                    </MenuItem>
                                    <MenuItem value={10}>
                                        10
                                    </MenuItem>
                                </TextField>
                            </div>
                            <TotalGrowthBarChart data={switchData()} title={'driver stats'} />
                        </MainCard>
                    </Grid>
                    <Grid item xs={12} md={4} >
                        <div style={{
                            backgroundColor: 'white',
                            width: '100%',
                            height: 600,
                            borderRadius: 20,
                            padding: 20
                        }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                                <span>passengers </span>
                                <Select
                                    value={passengersTop}
                                    onChange={(e) => setPassengersTop(e.target.value)}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                </Select>
                                <Select
                                    value={passengersMode}
                                    onChange={(e) => setPassengersMode(e.target.value)}
                                >
                                    <MenuItem value={'success'}>Top Trips Points</MenuItem>
                                    <MenuItem value={'failure'}>Most canceled Trips</MenuItem>
                                </Select>
                            </div>
                            <NivoArcChart data={dataPassenger(passengersMode)} />
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>

                    <Grid item xs={12} md={8}>
                        <div style={{width:'100%',height:600,backgroundColor:'white',borderRadius:10,padding:20}}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                                <span>{dailyWeeklyMode === 'day' ? 'daily' : 'weekly'} data </span>
                              
                                <Select
                                    value={dailyWeeklyMode}
                                    onChange={(e) => setDailyWeeklyMode(e.target.value)}
                                >
                                    <MenuItem value={'day'}>Trips Count per Day</MenuItem>
                                    <MenuItem value={'week'}>Trips Count per Week</MenuItem>
                                </Select>
                            </div>                        <NivoLineChart data={dailyWeeklyMode === "day"  ?  serializeData(dailyData,"day") :serializeData(weeklyData,"week") } xLegend={dailyWeeklyMode === 'day' ? 'day' : 'week'} yLegend={'Trips count'}/>
                        </div>
                           </Grid>
                    <Grid item xs={12} md={4}>
                        <div style={{
                            backgroundColor: 'white',
                            width: '100%',
                            height: 600,
                            borderRadius: 20,
                            padding: 20
                        }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                                <span>Starting/Finishing Points </span>
                                <Select
                                    value={pointsTop}
                                    onChange={(e) => setPointsTop(e.target.value)}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                </Select>
                                <Select
                                    value={pointsTopMode}
                                    onChange={(e) => setPointsTopMode(e.target.value)}
                                >
                                    <MenuItem value={'start'}>Top starting points</MenuItem>
                                    <MenuItem value={'finish'}>Top finishing points</MenuItem>
                                </Select>
                            </div>
                            <NivoArcChart disableLegends={true} data={pointsData()} />
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default AdminDash
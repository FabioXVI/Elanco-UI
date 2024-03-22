"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./main.css";
import NavBar from "../navbar/page";
import Footer from "../footer/page";
import Link from "next/link";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import url from 'url'
import querystring from 'querystring'
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";


// interface Data {
//   average_activityLevelSteps: number; // Adjust the type accordingly
//   // Add other properties as needed
// }
interface TempData {
  Date: string;
  Hour: number;
  HighestTemperature: number;
  AverageTemperature: number;
 }
interface DataItem {
  Id: number; // Adjust the type based on your actual data structure
  Date: string
  average_value_heart_rate: number;
  average_temperature: number;
  average_weight: number;
  average_breathing: number;
  average_calorieBurn: number;
  average_activityLevelSteps: number;
  average_foodIntake: number;
  average_waterIntake: number;

  DogID: string;
  AverageWalkingHours: number;
  AverageHoursSlept: number;
  AverageNormalHours:number;
  AverageEatingHours: number;

  Month_Year: string;
  totalWalkingHours: number;
  totalHoursSlept: number;
  totalSteps: number;
  totalIn: number;
  totalOut: number;
  totalwaterIntake: number;
}

const currentUrl = window.location.href;
const urlObj = new URL(currentUrl);
let dogNum = urlObj.searchParams.get('dog')
let date = urlObj.searchParams.get('date')


export default function Main() {

  // const [data, setData] = useState([]);

  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anotherData, setAnotherData] = useState<DataItem[]>([]);
  const [anotherLoading, setAnotherLoading] = useState(true);
  const [anotherError, setAnotherError] = useState<string | null>(null);
  const [another2Data, setAnother2Data] = useState<DataItem[]>([]);
  const [another2Loading, setAnother2Loading] = useState(true);
  const [another2Error, setAnother2Error] = useState<string | null>(null);
  const [another3Data, setAnother3Data] = useState<DataItem[]>([]);
  const [another3Loading, setAnother3Loading] = useState(true);
  const [another3Error, setAnother3Error] = useState<string | null>(null);
  const [dog, setDog] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // State to hold selected date

  const [tempData, setTempData] = useState<TempData[]>([]);

  useEffect(() => {
    const fetchTempData = async () => {
      const response = await fetch('http://localhost:4000/currentTempCanineOne');
      const newData: TempData[] = await response.json();
      setTempData(newData);
    };

    fetchTempData();
 }, []);


  useEffect(() => {


    const fetchData = async () => {
      try {
        const response1 = await axios.get<DataItem[]>('http://localhost:4000/average_'+dogNum);
        setData(response1.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
  
      try {
        const response2 = await axios.get<DataItem[]>('http://localhost:4000/BehaviourPatternActionsAverage' + dogNum);
        setAnotherData(response2.data);
        setAnotherLoading(false);
      } catch (error) {
        console.error('Error fetching another data:', error);
        setAnotherError('Error fetching another data');
        setAnotherLoading(false);
      }
  
      try {
        const response3 = await axios.get<DataItem[]>('http://localhost:4000/MonthlyAverage' + dogNum);
        setAnother2Data(response3.data);
        setAnother2Loading(false);
      } catch (error) {
        console.error('Error fetching another data:', error);
        setAnother2Error('Error fetching another data');
        setAnother2Loading(false);
      }
  
      try {
        const response4 = await axios.get<DataItem[]>('http://localhost:4000/averageEachDay' + dogNum);
        setAnother3Data(response4.data);
        setAnother3Loading(false);
      } catch (error) {
        console.error('Error fetching another data:', error);
        setAnother3Error('Error fetching another data');
        setAnother3Loading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  const handleChange = (event: SelectChangeEvent) => {
    setDog(event.target.value);
  };

  useEffect(() => {
    if (dog !== '') {
      const newUrl = new URL('http://localhost:3000/main');
      newUrl.searchParams.append('dog', dog);
      if (date !== null) {
        newUrl.searchParams.append('date', date);
      }
      window.location.href = newUrl.toString();
    }
  }, [dog, date]);


  const handleDogChange = (value: string) => {
    setDog(value);
  };

  const dogOptions = ['canineone', 'caninetwo', 'caninethree'];

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date); // Update selected date state
  };

  useEffect(() => {
  if (selectedDate) {
    const formattedDate = selectedDate.format('DD-MM-YYYY');
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('date', formattedDate);
    window.location.href = newUrl.toString();
  }
}, [selectedDate]);


  if (loading) return <p>Loading...</p>

  const chartData = data.map(item => ({
    hr: item.average_value_heart_rate,
    temp: item.average_temperature,
    wei: item.average_weight,
    breath: item.average_breathing,
    cal: item.average_calorieBurn,
    step: item.average_activityLevelSteps,
    food: item.average_foodIntake,
    water: item.average_waterIntake
  }));

  const anotherChartData = anotherData.map(item => ({
    ID: item.DogID,
    sleep: item.AverageHoursSlept,

  }));

  const anotherChart2Data = another2Data.map(item => ({
    monthYear: item.Month_Year,
    mhr: item.average_value_heart_rate,
    mtemp: item.average_temperature,
    mwei: item.average_weight,
    mbreath: item.average_breathing,
    mcal: item.average_calorieBurn,
    mstep: item.average_activityLevelSteps,
    mfood: item.average_foodIntake,
    mwater: item.average_waterIntake
  }));

  const anotherChart3Data = another3Data.map(item => ({
    Date: item.Date,
    dhr: item.average_value_heart_rate,
    dtemp: item.average_temperature,
    dwei: item.average_weight,
    dbreath: item.average_breathing,
    dcal: item.average_calorieBurn,
    dstep: item.average_activityLevelSteps,
    dfood: item.average_foodIntake,
    dwater: item.average_waterIntake,
    dwalk: item.totalWalkingHours,
    dslept: item.totalHoursSlept,
    tsteps: item.totalSteps,
    tin: item.totalIn,
    tout: item.totalOut

  }));


  const walkingHrs = anotherData.reduce((totalWalk, item) => totalWalk + item.AverageWalkingHours, 0);
  const sleepingHrs = anotherData.reduce((totalSleep, item) => totalSleep + item.AverageHoursSlept, 0);
  const walkingToday: number = another3Data
  .filter(item => item.Date === date)
  .map(item => item.totalWalkingHours)[0] || 0;
  const sleepingToday: number = another3Data
  .filter(item => item.Date === date)
  .map(item => item.totalHoursSlept)[0] || 0;
  const activityToday: number = another3Data
  .filter(item => item.Date === date)
  .map(item => item.totalSteps)[0] || 0;

  const sevenDaysAgo = dayjs(date, "DD-MM-YYYY").subtract(7, 'day');
  const tomorrow = dayjs(date, "DD-MM-YYYY").add(1, 'day');

  const walkingSeriesData = [
    { id: 0, value: (walkingToday-walkingHrs), color: '#5E8E23'},
    { id: 1, value: walkingToday, color: '#8ED834'},
    { id: 2, value: (walkingHrs-walkingToday), color: '#ADADAD'},
  ];

  const sleepingSeriesData = [
    { id: 0, value: (sleepingToday-sleepingHrs), color: '#1E227D'},
    { id: 1, value: sleepingToday, color: '#343CD8'},
    { id: 2, value: (sleepingHrs-sleepingToday), color: '#ADADAD'},
  ];
  

    const getSleepReviewMessage = (): string => {
      if (sleepingToday <= 0.9 * sleepingHrs) {
        return 'Your pet\'s sleeping activity is below average today.';
        
      } else if (sleepingToday - sleepingHrs > 0.1 * sleepingHrs) {
        return 'Your pet\'s sleeping activity is above average today.';
        
      } else {
        return 'Your pet\'s sleeping activity is within the normal range today.';
        
      }
    };

    const getWalkReviewMessage = (): string => {
      if (walkingToday <= 0.9 * walkingHrs) {
        return 'Your pet\'s walking activity is below average today.';
        
      } else if (walkingToday - walkingHrs > 0.1 * walkingHrs) {
        return 'Your pet\'s walking activity is above average today.';
        
      } else {
        return 'Your pet\'s walking activity is within the normal range today.';
        
      }
    };

  const filteredData = another3Data.filter(item => {
    const itemDate = dayjs(item.Date, "DD-MM-YYYY"); 
    return itemDate.isAfter(sevenDaysAgo, 'day') && itemDate.isBefore(tomorrow, 'day');
  });

const weekData = filteredData.map(item => ({
  Date: item.Date,
  Water: item.totalwaterIntake,
  Steps: item.totalSteps,
  calIn: item.totalIn,
  calOut: item.totalOut,
  Heart: item.average_value_heart_rate,
  Temperature: item.average_temperature,
  Weight: item.average_weight,
  Breathing: item.average_breathing,
}));

    
  return (
    <main>
        <div>
          <NavBar/>
          <div className="title">
            <h1>Welcome </h1>
          
            <div>
            <Box>
                <ButtonGroup variant="contained">
                  {dogOptions.map(option => (
                    <Button key={option} onClick={() => handleDogChange(option)} disabled={option === dogNum}>
                      {option}
                    </Button>
                  ))}
                </ButtonGroup>
                <br/>
                <br/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Select a date to view data"
                    format = "DD-MM-YYYY"
                    minDate= {dayjs("2021-1-1")}
                    maxDate= {dayjs("2023-12-31")}
                    onChange={handleDateChange}
                    defaultValue={dayjs(date, "DD-MM-YYYY")}
                  />
                </LocalizationProvider>
            
            </Box>
            </div>
            <h1><div style={{fontWeight: 'lighter'}}>Your pet's health at a glance</div></h1>
            
            </div>
          <div className="cards">
            <div className="card">
            
              Activity Level 
              <Link href={'/activity?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <div className="card-content">
              <p>Average {data.map(item => item.average_activityLevelSteps)} steps a day</p>

              {another3Data.length > 0 && (
                <Box flexGrow={1} style={{ marginRight: '10px' }}>
                <Typography>Steps This Week</Typography>
                <BarChart
                dataset={weekData}
                xAxis={[{ scaleType: 'band', dataKey: 'Date' }]}
                series={[{
                  dataKey: 'Steps', 
                  label: 'Steps',
                  color: '#343CD8'
                }]}
                width={300}
                height={300}
                tooltip={{ trigger: 'item' }}
                />
                </Box>
              )}

            </div>
            </div>
            <div className="card">
              Calories 
              <Link href={'/calories?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <div className="card-content">
              <p>Average {data.map(item => item.average_calorieBurn)} calories burned a day</p>
              {another3Data.length > 0 && (
                <Box flexGrow={1} style={{ marginRight: '10px' }}>
                <Typography>Calories This Week</Typography>
                <BarChart
                dataset={weekData}
                xAxis={[{ scaleType: 'band', dataKey: 'Date'}]}
                series={[
                  { dataKey: 'calIn', label: 'Kcal Eaten', color: '#D87E34'},
                  { dataKey: 'calOut', label: 'Kcal Burned', color: '#D8348E'},
                ]}
                width={300}
                height={300}
                tooltip={{ trigger: 'item' }}
                />
                </Box>
              )}
            </div>
            </div>
            <div className="card">
              Sleep 
              <Link href={'/sleep?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <div className="card-content">
              <p>Average {anotherData.map(item => item.AverageHoursSlept)} hours a day</p>
              <Typography>{getWalkReviewMessage()}
              <br/>
              <br/>
              {getSleepReviewMessage()}
              <br/>
              <br/>
              Todays activity compared to average</Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
    {another3Data.length > 0 && (
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
        
        <div style={{marginLeft: '55px'}}>
          <Typography style={{marginLeft:'-100px', fontWeight: 'bold'}}>Walking</Typography>
          <PieChart
            dataset={chartData}
            series={[{ data: walkingSeriesData, innerRadius: 20 }]}
            width={200}
            height={140}
            tooltip={{ trigger: 'item' }}
          />
        </div>
      </div>
    )}
    {another3Data.length > 0 && (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <Typography style={{marginLeft:'-100px' , fontWeight: 'bold'}}>Sleeping</Typography>
          <PieChart
            dataset={chartData}
            series={[{ data: sleepingSeriesData, innerRadius: 20 }]}
            width={200}
            height={140}
            tooltip={{ trigger: 'item' }}
          />
        </div>
      </div>
    )}
  </div>
              </div>
            </div>
            <div className="card">
              Water Intake 
              <Link href={'/water?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <div className="card-content">
              <p>Average {data.map(item => item.average_waterIntake)} ml a day</p>
              {another3Data.length > 0 && (
                <Box flexGrow={1} style={{ marginRight: '10px' }}>
                <Typography>Water Intake This Week</Typography>
                <BarChart
                dataset={weekData}
                xAxis={[{ scaleType: 'band', dataKey: 'Date' }]}
                series={[{
                  dataKey: 'Water', 
                  label: 'Water',
                  color: '#343CD8'
                }]}
                width={300}
                height={300}
                tooltip={{ trigger: 'item' }}
                />
                </Box>
              )}
            </div>
            </div>
            <div className="card">
              Heart Rate 
              <Link href={'/heart?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
            <div className="card-content">
              <p>Average {data.map(item => item.average_value_heart_rate)} beats per minute</p>
              {another3Data.length > 0 && (
                <Box flexGrow={1} style={{ marginRight: '10px' }}>
                <Typography>Average Heart Rate This Week</Typography>
                <LineChart
                dataset={weekData}
                xAxis={[{ scaleType: 'band', dataKey: 'Date' }]}
                series={[{
                  dataKey: 'Heart', 
                  label: 'Heart Rate',
                  color: '#B01C13'
                }]}
                width={300}
                height={300}
                tooltip={{ trigger: 'item' }}
                />
                </Box>
              )}
            </div>
            </div>
            <div className="card">
              Breathing Rate 
              <Link href={'/breathing?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
            <div className="card-content">
              <p>Average {data.map(item => item.average_breathing)} breaths per minute</p>
              {another3Data.length > 0 && (
                <Box flexGrow={1} style={{ marginRight: '10px' }}>
                <Typography>Average Breathing Rate This Week</Typography>
                <LineChart
                dataset={weekData}
                xAxis={[{ scaleType: 'band', dataKey: 'Date' }]}
                series={[{
                  dataKey: 'Breathing', 
                  label: 'Breathing Rate',
                  color: '#343CD8'
                }]}
                width={300}
                height={300}
                tooltip={{ trigger: 'item' }}
                />
                </Box>
              )}
            </div>
            </div>
            <div className="card">
              Temperature 
              <Link href={'/temperature?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
            <div className="card-content">
              <p>Average {data.map(item => item.average_temperature)}°c</p>
              {tempData.length > 0 ? (
        tempData.map((item, index) => (
          <div key={index}>
            {/* <p>Date: {item.Date}</p> */}
            {/* <p>Hour: {item.Hour}</p> */}
            {/* <p>Highest Temperature: {item.HighestTemperature}°C</p> */}
            <Typography>Today your dogs average temperature is {item.AverageTemperature}°C and its highest was {item.HighestTemperature}°C at {item.Hour}:00</Typography>
            {/* <p>this is an exceptionally high temperature and can mean that your dog could end up getting a fever</p> */}
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
              {another3Data.length > 0 && (
                <Box flexGrow={1} style={{ marginRight: '10px' }}>
                <Typography>Average Temperature This Week</Typography>
                <LineChart
                dataset={weekData}
                xAxis={[{ scaleType: 'band', dataKey: 'Date' }]}
                series={[{
                  dataKey: 'Temperature', 
                  label: 'Temperature',
                  color: '#B01C13'
                }]}
                width={300}
                height={200}
                tooltip={{ trigger: 'item' }}
                />
                </Box>
              )}

              

            </div>
            </div>
            <div className="card">
              Weight 
              <Link href={'/weight?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
            <div className="card-content">
              <p>Average {data.map(item => item.average_weight)}kg</p>
              {another3Data.length > 0 && (
                <Box flexGrow={1} style={{ marginRight: '10px' }}>
                <Typography>Average Weight This Week</Typography>
                <LineChart
                dataset={weekData}
                xAxis={[{ scaleType: 'band', dataKey: 'Date' }]}
                series={[{
                  dataKey: 'Weight', 
                  label: 'Weight',
                  color: '#D87E34'
                }]}
                width={300}
                height={300}
                tooltip={{ trigger: 'item' }}
                />
                </Box>
              )}


              
            </div>
            </div>
            <div className="card">
              Extra card 
              <Link href={'/activity?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
            <div className="card-content">
            </div>
            </div>
          </div>
          <br />
        </div>
        <Footer/>
    </main>
  );
}
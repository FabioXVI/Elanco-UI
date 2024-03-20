"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import axios from 'axios';

import "./main.css";
import NavBar from "../navbar/page";
import Footer from "../footer/page";
import Link from "next/link";
import { Box, Button, ButtonGroup } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { LineChart } from '@mui/x-charts/LineChart';

// interface Data {
//   average_activityLevelSteps: number; // Adjust the type accordingly
//   // Add other properties as needed
// }
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
}

interface CaloriesBurnedData {
  TotalCaloriesBurned: number;
}

const currentUrl = window.location.href;
const urlObj = new URL(currentUrl);
let dogNum = urlObj.searchParams.get('dog')
console.log(dogNum)

export default function Main() {
  // const [data, setData] = useState([]);


  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anotherData, setAnotherData] = useState<DataItem[]>([]);
  const [anotherLoading, setAnotherLoading] = useState(true);
  const [anotherError, setAnotherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>('http://localhost:4000/average_'+dogNum);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAnotherData = async () => {
      try {
        const response = await axios.get<DataItem[]>('http://localhost:4000/BehaviourPatternActionsAverage' + dogNum);
        setAnotherData(response.data);
        setAnotherLoading(false);
      } catch (error) {
        console.error('Error fetching another data:', error);
        setAnotherError('Error fetching another data');
        setAnotherLoading(false);
      }
    };

    fetchAnotherData();
  }, []);

  const [dog, setDog] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setDog(event.target.value);
  };

  useEffect(() => {
    if (dog !== '') {
      var url = require('url');
      const adr = new URL('http://localhost:3000/main');
      adr.searchParams.append('dog', dog);
      window.location.href = adr.toString();
    }
  }, [dog]);

  const handleDogChange = (value: string) => {
    setDog(value);
  };

  const dogOptions = ['canineone', 'caninetwo', 'caninethree'];

  useEffect(() => {
  const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:4000/averageEachDayCanineOne' + dogNum);
    setData(response.data);
    setLoading(false);
    } catch (error) {
    console.error('Error fetching data:', error);
    setError("Error fetching data:");
    setLoading(false);
    }
  };
    fetchData();
  }, []);

  const [caloriesBurnedYesterday, setCaloriesBurnedYesterday] = useState<CaloriesBurnedData | null>(null);
  useEffect(() => {
    const fetchCaloriesBurnedYesterday = async () => {
      try {
        const response = await axios.get('http://localhost:4000/weeklyTotalCalorieBurn_' + dogNum);
        setCaloriesBurnedYesterday(response.data);
      } catch (error) {
        console.error('Error fetching calories burned yesterday:', error);
      }
    };

    fetchCaloriesBurnedYesterday();
 }, []);

  if (loading) return <p>Loading...</p>

  const chartData = data.map(item => ({
    hr: item.average_value_heart_rate,
    temp: item.average_temperature,
    wei: item.average_weight,
    breath: item.average_breathing,
    cal: item.average_calorieBurn,
    step: item.average_activityLevelSteps,
    food: item.average_foodIntake,
    water: item.average_waterIntake,

    monthYear: item.Month_Year,
    value: item.average_calorieBurn
  }));

  const anotherChartData = anotherData.map(item => ({
    ID: item.DogID,
    sleep: item.AverageHoursSlept,
    name: item.Month_Year,
    value: item.average_calorieBurn

  }));

  const thirdChartData = Array.isArray(caloriesBurnedYesterday)
  ? caloriesBurnedYesterday.map((item, index) => ({
       value: item.TotalCaloriesBurned,
       label: item.Date,
     }))
  : [];

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
            </Box>
            </div>
            <h1><div style={{fontWeight: 'lighter'}}>Your pet's health at a glance</div></h1>
            </div>
          <div className="cards">
            <div className="card">
              Activity Level
              <Link href={'/activity?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <p>Average {data.map(item => item.average_activityLevelSteps)} steps a day</p>
            </div>
            <div className="card">
              Calories
              <Link href={'/calories?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <LineChart
                dataset={thirdChartData}
                xAxis={[
                    {
                      scaleType: "band",
                      data: thirdChartData.map(item => item.label),
                      valueFormatter: (date) => {
                        const [day, month, year] = date.split('-');
                        const formattedDate = `${day}/${month}`;
                        return formattedDate;
                      },
                    },
                ]}
                series={[
                    {
                      label: 'Most recent week daily calories burned',
                      curve: "linear",
                      color: "#FF0000",
                      data: thirdChartData.map(item => item.value),
                    },
                ]}
                width={500}
                height={300}
                tooltip={{trigger: "item"}}
              />
            </div>
            <div className="card">
              Sleep
              <Link href={'/sleep?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <p>Average {anotherData.map(item => item.AverageHoursSlept)} hours a day</p>
            </div>
            <div className="card">
              Water Intake
              <Link href={'/water?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <p>Average {data.map(item => item.average_waterIntake)} ml a day</p>
            </div>
            <div className="card">
              Heart Rate
              <Link href={'/heart?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <p>Average {data.map(item => item.average_value_heart_rate)} beats per minute</p>
            </div>
            <div className="card">
              Breathing Rate
              <Link href={'/breathing?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <p>Average {data.map(item => item.average_breathing)} breaths per minute</p>
            </div>
            <div className="card">
              Temperature
              <Link href={'/temperature?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <p>Average {data.map(item => item.average_temperature)}°c</p>
            </div>
            <div className="card">
              Weight
              <Link href={'/weight?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
              <br/>
              <p>Average {data.map(item => item.average_weight)}kg</p>
            </div>
            <div className="card">
              Extra card
              <Link href={'/activity?dog='+dogNum}><div className="viewmore">View more {">"}</div></Link>
            </div>
          </div>
          <br />
        </div>
        <Footer/>
    </main>
  );
}
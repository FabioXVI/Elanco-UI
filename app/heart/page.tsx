"use client";
import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts';
import axios from "axios";
import NavBar from "../navbar/page";
import Footer from "../footer/page";
import { Box, Button, ButtonGroup } from "@mui/material";
import './heart.css';

interface DataItem {
  Id: number;
  Date: string;
  average_value_heart_rate: number;
}
const currentUrl = window.location.href;
const urlObj = new URL(currentUrl);
let dogNum = urlObj.searchParams.get('dog')
console.log(dogNum)

export default function Heart() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<{ [key: number]: string | null }>({});
  const [anotherData, setAnotherData] = useState<DataItem[]>([]);
  const [anotherLoading, setAnotherLoading] = useState(true);
  const [anotherError, setAnotherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>('http://localhost:4000/averageEachDay' + dogNum);
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
        const response = await axios.get<DataItem[]>('http://localhost:4000/averageEachDay' + dogNum);
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

  const handleDogChange = (value: string) => {
    setDog(value);
  };

  const dogOptions = ['canineone', 'caninetwo', 'caninethree'];

  useEffect(() => {
    if (dog !== '') {
      var url = require('url');
      const adr = new URL('http://localhost:3000/heart');
      adr.searchParams.append('dog', dog);
      window.location.href = adr.toString();
    }
  }, [dog]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const years = [2021, 2022, 2023];

  const handleDateChange = (year: number, date: string | null) => {
    setSelectedDates(prevState => ({
      ...prevState,
      [year]: date
    }));
  };

  return (
    <main>
      <div>
        <NavBar />
      </div>
      <div>
        <h1>Heart Rate Page</h1>
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
        {years.map((year, index) => {
          const filteredData = getFilteredData(year);
          const average = calculateAverage(filteredData);
          return (
            <div key={index}>
              <h2>{year}</h2>
              <div>
                <label>Insert Day and Month: </label>
                <input
                  type="text"
                  placeholder="DD-MM"
                  value={selectedDates[year] || ''}
                  onChange={(e) => handleDateChange(year, e.target.value)}
                />
              </div>
              <div className='heartGraphContainer'>
                <div className='average'>Average heart rate: {average.toFixed(1)}</div>
                <LineChart
                  xAxis={[{ scaleType: 'band', data: filteredData.map(item => formatDate(item.Date)) }]}
                  series={[
                    {
                      color: "#FF0000",
                      type: "line",
                      data: filteredData.map(item => item.average_value_heart_rate),
                      curve: "linear"
                    }
                  ]}
                  height={400}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <Footer />
      </div>
    </main>
  );

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  }

  function getFilteredData(year: number): DataItem[] {
    if (!selectedDates[year]) {
        // If no specific date is selected, return data for each day of the year
        return data.filter(item => new Date(item.Date).getFullYear() === year);
    } else {
        const parts = selectedDates[year]!.split('-');
        if (parts.length === 2) {
            // If day and month are provided, filter data for the selected week
            const [day, month] = parts.map(Number);
            const selectedDate = new Date(year, month - 1, day); // Create a Date object for the selected date

            // Set the start date to the selected date
            const startDate = new Date(selectedDate);

            // Set the end date to 6 days after the selected date
            const endDate = new Date(selectedDate);
            endDate.setDate(selectedDate.getDate() + 6);

            // Ensure the end date does not exceed the month boundary
            const endOfMonth = new Date(year, month, 0);
            if (endDate > endOfMonth) {
                endDate.setDate(endOfMonth.getDate());
            }

            return data.filter(item => {
                const date = new Date(item.Date);
                return date >= startDate && date <= endDate && date.getMonth() === selectedDate.getMonth();
            });
        }
    }
    return [];
  }
}

function calculateAverage(data: DataItem[]): number {
  const sum = data.reduce((acc, curr) => acc + curr.average_value_heart_rate, 0);
  return sum / data.length;
}
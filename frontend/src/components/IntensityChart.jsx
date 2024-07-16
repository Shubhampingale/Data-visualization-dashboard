import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Box, Heading, Select } from '@chakra-ui/react';

const IntensityChart = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState('All');
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    let filteredData = data;
    if (selectedYear !== 'All') {
      filteredData = data.filter(item => item.start_year.toString() === selectedYear);
    }

    const intensityData = filteredData.map(item => item.intensity);
    const years = filteredData.map(item => item.start_year);

    const getColor = '#7F00FF'; // Single color for all bars

    const margin = { top: 20, right: 20, bottom: 70, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG if exists
    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(years)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(intensityData)])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')
      .style('text-anchor', 'end')
      .style('font-family', 'Roboto')
      .style('font-size', '14px')
      .style('font-weight', 'bold');

    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d => `${d}%`))
      .selectAll('text')
      .style('font-family', 'Roboto')
      .style('font-size', '14px')
      .style('font-weight', 'bold');

    svg.selectAll('.bar')
      .data(intensityData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => x(years[i]))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d))
      .attr('height', d => height - y(d))
      .attr('fill', getColor) // Single color for all bars
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('opacity', 0.7);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).transition().duration(200).attr('opacity', 1);
      });

  }, [data, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const uniqueYears = [...new Set(data.map(item => item.start_year))];

  return (
    <Box margin={50} p={4} mt={8} borderRadius={18} boxShadow ='0px 0px 10px rgba(0, 0, 0, 0.1)'>
      <Heading as="h2" mb={4} textAlign="center">
        Intensity Chart
      </Heading>
      <Select
        value={selectedYear}
        onChange={handleYearChange}
        mb={4}
        w="200px"
        colorScheme="purple"
      >
        <option value="All">All Years</option>
        {uniqueYears.map(year => (
          <option key={year} value={year.toString()}>{year}</option>
        ))}
      </Select>
      <Box ref={chartRef}></Box>
    </Box>
  );
};

export default IntensityChart;

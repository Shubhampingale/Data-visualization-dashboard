// src/components/Country.jsx

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Box,
  Flex,
  Heading,
  Select,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";

const CountryChart = ({ data }) => {
  const { colorMode } = useColorMode();
  const [selectedCountry, setSelectedCountry] = useState("United States of America");
  const chartRef = useRef();

  useEffect(() => {
    const countryData = data.filter(entry => entry.country === selectedCountry);
    
    const sectors = {};
    countryData.forEach(entry => {
      if (!sectors[entry.sector]) {
        sectors[entry.sector] = 0;
      }
      sectors[entry.sector] += entry.intensity;
    });

    const sectorLabels = Object.keys(sectors);
    const sectorIntensities = sectorLabels.map(sector => sectors[sector]);

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(sectorLabels)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sectorIntensities)])
      .nice()
      .range([height, 0]);

    const chartBackgroundColor = colorMode === "light" ? "#4F3BA9" : "#9068BE";

    const svgContainer = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgContainer.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svgContainer.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    svgContainer.selectAll(".bar")
      .data(sectorLabels)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d))
      .attr("y", d => y(sectors[d]))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(sectors[d]))
      .attr("fill", chartBackgroundColor);

  }, [selectedCountry, data, colorMode]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <Box p={6} shadow="md" bg={useColorModeValue("white", "gray.800")} m={50}>
      <Flex direction="column" margin='auto'>
        <Heading as="h2" textAlign="left" mb={4} style={{ textAlign: "left" }}>
          Country Chart
        </Heading>
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          mb={4}
          w="200px"
          colorScheme="purple"
        >
          <option value="United States of America">United States of America</option>
          <option value="Mexico">Mexico</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Lebanon">Lebanon</option>
          <option value="Russia">Russia</option>
          <option value="Saudi Arabia">Saudi Arabia</option>
        </Select>
        <Box height="500px" width="100%">
          <svg ref={chartRef} width="100%" height="100%"></svg>
        </Box>
      </Flex>
    </Box>
  );
};

export default CountryChart;

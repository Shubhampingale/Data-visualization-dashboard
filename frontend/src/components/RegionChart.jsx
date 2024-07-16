import React, { useEffect, useRef } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import * as d3 from 'd3';

const RegionChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Count occurrences of each region
    const regionCounts = {};
    data.forEach((item) => {
      if (item.region in regionCounts) {
        regionCounts[item.region]++;
      } else {
        regionCounts[item.region] = 1;
      }
    });

    // Prepare data for D3
    const dataset = Object.entries(regionCounts).map(([region, count]) => ({
      region,
      count,
    }));

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Color scale for regions
    const color = d3.scaleOrdinal()
      .domain(dataset.map(d => d.region))
      .range(d3.schemeCategory10);

    // Arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.5) // Inner radius for doughnut chart
      .outerRadius(radius); // Outer radius

    // Pie layout generator
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    // SVG element
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Draw arcs
    const arcs = svg.selectAll('arc')
      .data(pie(dataset))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Append paths
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.region))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    return () => {
      // Clean up
      svg.selectAll('*').remove();
    };

  }, [data]);

  // Prepare data for the legend
  const regionCounts = {};
  data.forEach((item) => {
    if (item.region in regionCounts) {
      regionCounts[item.region]++;
    } else {
      regionCounts[item.region] = 1;
    }
  });
  const dataset = Object.entries(regionCounts).map(([region, count]) => ({
    region,
    count,
  }));

  const color = d3.scaleOrdinal()
    .domain(dataset.map(d => d.region))
    .range(d3.schemeCategory10);

  return (
    <Box>
      <Heading as="h2" mb={4}>
        Region Distribution
      </Heading>
      <Flex wrap="wrap" mb={4}>
        {dataset.map(({ region }) => (
          <Flex key={region} alignItems="center" mr={4} mb={2}>
            <Box
              w={4}
              h={4}
              mr={2}
              bg={color(region)}
            />
            <Box>{region}</Box>
          </Flex>
        ))}
      </Flex>
      <div ref={chartRef}></div>
    </Box>
  );
};

export default RegionChart;

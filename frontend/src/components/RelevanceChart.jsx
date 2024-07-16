import React, { useEffect, useRef } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import * as d3 from 'd3';

const RelevanceBubbleChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Set up dimensions and margins
    const margin = { top: 20, right: 20, bottom: 70, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.likelihood)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.impact)])
      .range([height, 0]);

    const rScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.relevance)])
      .range([2, 20]); // Adjust bubble size range as needed

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.bottom / 1.5)
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .attr('font-size', '1.2em')
      .attr('text-anchor', 'middle')
      .text('Likelihood');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left / 1.5)
      .attr('x', -height / 2)
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .attr('font-size', '1.2em')
      .attr('text-anchor', 'middle')
      .text('Impact');

    // Add bubbles
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.likelihood))
      .attr('cy', d => yScale(d.impact))
      .attr('r', d => rScale(d.relevance))
      .style('fill', 'rgba(79, 59, 169, 0.7)')
      .style('stroke', 'rgba(79, 59, 169, 1)')
      .style('stroke-width', 2);

    return () => {
      // Clean up
      svg.selectAll('*').remove();
    };

  }, [data]);

  return (
    <Box margin={50} p={4} mt={8} borderRadius={18} boxShadow ='0px 0px 10px rgba(0, 0, 0, 0.1)'>
      <Heading as="h2" mb={4}>Relevance Chart</Heading>
      <div ref={chartRef}></div>
    </Box>
  );
};

export default RelevanceBubbleChart;

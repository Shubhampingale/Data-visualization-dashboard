import React, { useEffect, useRef } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import * as d3 from 'd3';

const TopicsScatterPlot = ({ data }) => {
  const chartRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.relevance)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.likelihood)])
      .range([height, 0]);

    // Color scale for topics
    const colorScale = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.topic))])
      .range(d3.schemeCategory10);

    // Draw circles (scatter plot points)
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.relevance))
      .attr('cy', d => yScale(d.likelihood))
      .attr('r', 5)
      .style('fill', d => colorScale(d.topic))
      .style('stroke', 'black')
      .style('stroke-width', 0.5);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Legend
    const topics = [...new Set(data.map(item => item.topic))];
    const legend = d3.select(legendRef.current);

    legend.selectAll('*').remove();

    topics.forEach((topic, index) => {
      const legendItem = legend.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('margin-right', '20px');

      legendItem.append('div')
        .style('width', '10px')
        .style('height', '10px')
        .style('background-color', colorScale(topic))
        .style('border-radius', '50%')
        .style('margin-right', '5px');

      legendItem.append('div')
        .style('font-size', 'sm')
        .text(topic);
    });

    return () => {
      // Clean up
      svg.selectAll('*').remove();
      legend.selectAll('*').remove();
    };

  }, [data]);

  return (
    <Box>
      <Heading as="h2" size="xl" mb={4}>
        Topics Chart
      </Heading>
      <Flex alignItems="center" justifyContent="center" mb={4}>
        <Flex ref={legendRef} alignItems="center" flexWrap="wrap">
          {data && data.length > 0 && [...new Set(data.map(item => item.topic))].map((topic, index) => (
            <Flex key={index} alignItems="center" mr={4}>
              <Box w="10px" h="10px" bg="steelblue" borderRadius="50%" mr={2}></Box>
              <Box fontSize="sm">{topic}</Box>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <div ref={chartRef}></div>
    </Box>
  );
};

export default TopicsScatterPlot;

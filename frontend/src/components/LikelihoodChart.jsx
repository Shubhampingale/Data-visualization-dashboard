import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Box, useColorModeValue, Heading, Tooltip } from "@chakra-ui/react";

const LikelihoodBarChart = ({ data }) => {
  const chartRef = useRef();
  const bgColor = useColorModeValue("white", "gray.800"); // Background color based on Chakra UI color mode
  const [tooltipContent, setTooltipContent] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right; // Increased width here
    const height = 400 - margin.top - margin.bottom;

    // Clear existing SVG contents
    d3.select(chartRef.current).selectAll("svg").remove();

    // Create SVG element
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.likelihood)])
      .nice()
      .range([height, 0]);

    // X scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, width])
      .padding(0.1);

    // Bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.country))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.likelihood))
      .attr("height", (d) => height - y(d.likelihood))
      .style("fill", "steelblue")
      .on("mouseover", (event, d) => {
        setTooltipContent(d.country);
      })
      .on("mousemove", (event, d) => {
        const [xPos, yPos] = d3.pointer(event);
        d3.select(".tooltip")
          .style("left", `${xPos + 10}px`)
          .style("top", `${yPos}px`);
      })
      .on("mouseout", () => {
        setTooltipContent(null);
      });

    // Y axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Cleanup function
    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return (
    <Box
      borderRadius={20}
      pt={6}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
      mt={50}
      shadow="md"
      pb={100}
      bg={bgColor}
      maxHeight={700}
      overflow="hidden"
      position="relative"
    >
      <Heading as="h2" mb={4} ml={6}>
        Likelihood Bar Chart
      </Heading>
      <div ref={chartRef}></div>
      {tooltipContent && (
        <Tooltip label={tooltipContent} isOpen={tooltipContent !== null} className="tooltip">
          <Box
            position="absolute"
            backgroundColor="white"
            boxShadow="md"
            p={2}
            borderRadius="md"
            zIndex="tooltip"
            pointerEvents="none"
          >
            {tooltipContent}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default LikelihoodBarChart;

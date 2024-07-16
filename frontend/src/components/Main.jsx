import React, { useState, useEffect } from "react";
import axios from "axios";
import IntensityChart from "./IntensityChart";
import { ChakraProvider, Flex, Box, Grid } from "@chakra-ui/react";
import RegionChart from "./RegionChart";
import RelevanceBubbleChart from "./RelevanceChart";
import TopicsScatterPlot from "./TopicChart";
import LikelihoodBarChart from "./LikelihoodChart";
import CountryChart from "./CountryChart";
import Footer from "./Footer";

const Main = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      const API_URL = "http://localhost:5000";
      try {
        const response = await axios.get(`${API_URL}/api/data`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromApi();
  }, []);

  return (
    <ChakraProvider>
      <IntensityChart data={data} />
      <Flex direction={{ base: "column", md: "row" }} m={50}>
        <Box
          flex={{ base: "1", md: "0.5" }}
          maxW="50%"
          p={5}
          m={2}
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
          borderRadius={20}
        >
          <RegionChart data={data} />
        </Box>
        <Box
          flex={{ base: "1", md: "0.5" }}
          maxW="50%"
          p={5}
          m={2}
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
          borderRadius={20}
        >
          <TopicsScatterPlot data={data} />
        </Box>
      </Flex>
      <RelevanceBubbleChart data={data} />
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <Box>
          <CountryChart data={data} />
        </Box>
        <Box>
          <LikelihoodBarChart data={data} />
        </Box>
      </Grid>
      <Footer />
    </ChakraProvider>
  );
};

export default Main;

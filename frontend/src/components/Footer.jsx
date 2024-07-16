import React from "react";
import { Box, Text, Link, Flex, useColorModeValue, Icon } from "@chakra-ui/react";
import { RiGithubFill, RiLinkedinFill, RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const footerBgColor = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box bg={footerBgColor} py={4} px={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        maxW="container.lg"
        mx="auto"
      >
        <Text fontSize="sm" color="gray.500" mb={{ base: 2, md: 0 }}>
          &copy; 2024 Shubham S. Pingale. All rights reserved.
        </Text>
        <Flex alignItems="center" wrap="wrap">
          <Link mx={2} fontSize="sm" color="gray.500" href="#">
            Privacy Policy
          </Link>
          <Link mx={2} fontSize="sm" color="gray.500" href="#">
            Terms of Service
          </Link>
          <Link href="#" mr={4}>
          <Icon as={RiLinkedinFill} boxSize={6} />
        </Link>
        <Link href="#" mr={4}>
          <Icon as={RiGithubFill} boxSize={6} />
        </Link>
          <Link mx={2} href="#" isExternal>
            <Icon as={RiInstagramFill} boxSize={5} color={iconColor} />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;

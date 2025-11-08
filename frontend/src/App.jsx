import { useState, useEffect } from "react";
import "./App.css";
import { getLastThousandMatters } from "./api";
import { Heading, Flex, Box } from "@chakra-ui/react";
import Dashboard from "./Pages/Dashboard";

function App() {
  const [loading, setLoading] = useState(true);
  const [lastThousandMatters, setLastThousandMatters] = useState([]);

  async function handleGetRecentMatters() {
    setLoading(true);
    try {
      // const [pastSix, introMatters, inProgress] = await Promise.all([
      //   getPastSixMonOfMatters(),
      //   getMatters(),
      //   getInProgMatters(),
      // ]);
      // // Matters & inprog matters for future improvement in filtering
      // setPastSixMonOfMatters(pastSix);
      // setMatters(introMatters);
      // setInProgMatters(inProgress);
      const lastThousandMattersRes = await getLastThousandMatters();
      setLastThousandMatters(lastThousandMattersRes);
    } catch (error) {
      console.error("Failed to fetch matters:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    handleGetRecentMatters();
  }, []);
  return (
    <div className="wrapper">
      <Flex
        height="4rem"
        width="100%"
        bg="linear-gradient(90deg,rgb(81, 106, 176),rgb(122, 141, 181))"
        align="center"
        justify="center"
        boxShadow={"md"}
        position="sticky"
        px={6}
        zIndex={10}
      >
        <Heading size="xl" fontWeight="extrabold" lineHeight={"1.7"}>
          <Box as="span" color="white" pl={2}>
            Legi
          </Box>
          <Box
            as="span"
            display="inline-block"
            bgGradient="linear-gradient(45deg, rgb(250, 218, 97) 0%, rgb(255, 145, 136) 50%, rgb(255, 90, 205) 100%)"
            bgClip="text"
            fontFamily="'Momo Signature', cursive"
            fontStyle="italic"
            pr={2}
          >
            Sight
          </Box>
        </Heading>
      </Flex>

      <Dashboard lastThousandMatters={lastThousandMatters} loading={loading} />
    </div>
  );
}

export default App;

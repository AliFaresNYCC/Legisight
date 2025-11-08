import {
  ArrowBackIcon,
  ChevronDownIcon,
  InfoOutlineIcon,
  QuestionIcon,
  TimeIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Tooltip as ChakraTooltip,
  Checkbox,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ClockPlus, Funnel, Trash2 } from "lucide-react";
import { useState } from "react";
import { Chrono } from "react-chrono";
import "react-chrono/dist/style.css";
import { getMatterHistory, getFilteredMatters } from "../api";

function Dashboard({ pastSixMonOfMatters, loading }) {
  console.log(
    "Here are the past 6mon of patters inside dashboard: ",
    pastSixMonOfMatters
  );

  const [searchBy, setSearchBy] = useState("Law #");
  const [query, setQuery] = useState(null);
  const [filteredMatters, setFilteredMatters] = useState(null);
  const [matterHistory, setMatterHistory] = useState(null);
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem("watchlist") || "[]");
  });
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingWatchList, setLoadingWatchList] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

  async function handleGetMatterHistory(matterId) {
    setLoadingHistory(true);
    try {
      const history = await getMatterHistory(matterId);
      setMatterHistory(history);
    } catch (error) {
      console.error("Failed to fetch matter history:", error);
    } finally {
      setLoadingHistory(false);
    }
  }

  function handleAddMatterToWatchList(matter) {
    setWatchlist((prev) => {
      if (prev.some((item) => item.MatterId === matter.MatterId)) return prev;
      const updated = [...prev, matter];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    });
  }

  async function handleSearch() {
    const searchQuery = query?.trim();
    let filter;
    switch (searchBy) {
      case "Law #":
        filter = `MatterEnactmentNumber+eq+'${searchQuery}'`;
        break;
      case "File #":
        filter = `MatterFile+eq+'${searchQuery}'`;
        break;
      case "Title":
        filter = `substringof('${searchQuery}',MatterTitle)`;
        break;
      case "Name":
        filter = `substringof('${searchQuery}',MatterName)`;
        break;
      case "Summary":
        filter = `substringof('${searchQuery}',MatterEXText5)`;
        break;
      case "Committee":
        filter = `MatterBodyName+eq+'${searchQuery}'`;
        break;
      default:
        filter = `MatterEnactmentNumber+eq+'${searchQuery}'`;
    }
    setLoadingSearch(true);
    try {
      const matters = await getFilteredMatters(filter);
      setFilteredMatters(matters);
    } catch (error) {
      console.error("Failed to fetch matters:", error);
    } finally {
      setLoadingSearch(false);
    }
  }

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={4}
      p={4}
      flex={1}
      wrap="wrap"
      bg="gray.50"
    >
      <Card flex={1} maxW="100%">
        <CardHeader pb={4}>
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="md">Matters</Heading>
            <ChakraTooltip
              label="This section shows your matters"
              fontSize="sm"
              hasArrow
              placement="top"
            >
              <QuestionIcon
                w={5}
                h={5}
                color="gray.500"
                cursor="pointer"
                _hover={{ color: "rgb(81, 106, 176)" }}
              />
            </ChakraTooltip>
          </Flex>

          <Flex align={"center"} gap={2}>
            <InputGroup size="md" w="100%">
              <InputLeftElement width="7rem">
                <Menu>
                  <MenuButton
                    as={Button}
                    size="sm"
                    w="6.5rem"
                    variant="ghost"
                    rightIcon={<ChevronDownIcon />}
                    justifyContent="flex-start"
                    fontWeight="normal"
                    fontSize="sm"
                    bgColor={"gray.200"}
                    _hover={{ backgroundColor: "rgb(221, 221, 221)" }}
                  >
                    <Text isTruncated>{searchBy}</Text>
                  </MenuButton>
                  <MenuList portal sx={{ zIndex: 1000 }}>
                    <MenuItem onClick={() => setSearchBy("Law #")}>
                      Law #
                    </MenuItem>
                    <MenuItem onClick={() => setSearchBy("File #")}>
                      File #
                    </MenuItem>
                    <MenuItem onClick={() => setSearchBy("Title")}>
                      Title
                    </MenuItem>
                    <MenuItem onClick={() => setSearchBy("Name")}>
                      Name
                    </MenuItem>
                    <MenuItem onClick={() => setSearchBy("Summary")}>
                      Summary
                    </MenuItem>
                    <MenuItem onClick={() => setSearchBy("Committee")}>
                      Committee
                    </MenuItem>
                  </MenuList>
                </Menu>
              </InputLeftElement>

              <Input
                pl="7.5rem"
                variant="filled"
                placeholder={`Search by Matter ${searchBy.toLowerCase()}...`}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query?.trim()) {
                    handleSearch();
                  }
                }}
                borderRadius="md"
                sx={{
                  "::selection": {
                    backgroundColor: "blue.400",
                    color: "white",
                  },
                }}
              />
              <InputRightElement
                w={"fit-content"}
                pr={2}
                cursor={!query?.trim() ? "not-allowed" : "pointer"}
              >
                <SearchIcon
                  color={!query?.trim() ? "gray.300" : "gray.500"}
                  onClick={handleSearch}
                />
              </InputRightElement>
            </InputGroup>

            <Popover placement="bottom-start" closeOnBlur>
              <PopoverTrigger>
                <Button padding={1}>
                  <Funnel color="grey" size={18} />
                </Button>
              </PopoverTrigger>

              <PopoverContent w="200px" p={2}>
                <PopoverBody>
                  <VStack align="start" spacing={2}>
                    <Checkbox size="sm">Open Matters</Checkbox>
                    <Checkbox size="sm">Closed Matters</Checkbox>
                    <Checkbox size="sm">High Priority</Checkbox>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </CardHeader>
        <Divider
          w="90%"
          m="auto"
          borderColor="gray.200"
          borderWidth="1px"
          zIndex={"0"}
        />{" "}
        <CardBody
          display="flex"
          flexDir="column"
          pt={4}
          justifyContent={"center"}
          alignItems={"center"}
          maxH="77dvh"
        >
          {loading || loadingHistory || loadingSearch ? (
            <Box
              flex="1"
              borderRadius="md"
              bgGradient="linear(to-r, #e2e8f0 0%, #f8fafc 50%, #e2e8f0 100%)"
              bgSize="200% 100%"
              animation={`${shimmer} 1.5s infinite`}
              w={"100%"}
              h={"100%"}
            >
              {" "}
            </Box>
          ) : filteredMatters ? (
            filteredMatters?.length > 0 ? (
              <VStack
                spacing={2}
                w={"100%"}
                flex="1"
                borderRadius="md"
                bgColor={"gray.200"}
                p={2}
                align={"stretch"}
                overflowY="auto"
              >
                {filteredMatters.map((matter, idx) => (
                  <Card
                    className="filtered-matter-card"
                    key={idx}
                    as="article"
                    p={4}
                    pr={5}
                    borderRadius="md"
                    bg="white"
                    boxShadow="sm"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-2px)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    cursor="pointer"
                    position="relative"
                    flex={1}
                    onClick={() => handleGetMatterHistory(matter.MatterId)}
                  >
                    {" "}
                    <ChakraTooltip
                      label="Add to watchlist"
                      fontSize="sm"
                      hasArrow
                      placement="top"
                    >
                      <Box
                        position="absolute"
                        top={1}
                        right={1}
                        className="add-to-history"
                        cursor={"pointer"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddMatterToWatchList(matter);
                        }}
                      >
                        <Icon
                          as={ClockPlus}
                          w={5}
                          h={5}
                          color="gray.400"
                          _hover={{ color: "gray.600" }}
                        />
                      </Box>
                    </ChakraTooltip>
                    <Heading
                      size="sm"
                      isTruncated
                      mb={1}
                      title={matter.MatterTitle}
                    >
                      {matter.MatterTitle}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      File: {matter.MatterFile}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Status: {matter.Status || "N/A"} | Committee:{" "}
                      {matter.Committee || "N/A"}
                    </Text>
                  </Card>
                ))}
              </VStack>
            ) : (
              <Box
                p={4}
                bgColor={"gray.200"}
                borderRadius="md"
                shadow="md"
                w="100%"
                h="100%"
                display="flex"
                flexDirection="column"
              >
                <Flex
                  flex="1"
                  direction="column"
                  align="center"
                  justify="center"
                  py={10}
                  px={4}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px dashed"
                  borderColor="gray.300"
                  textAlign="center"
                >
                  <Icon
                    as={InfoOutlineIcon}
                    w={8}
                    h={8}
                    color="gray.400"
                    mb={2}
                  />
                  <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                    No matters found
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Try adjusting your search query, search type, or check back
                    later.
                  </Text>
                </Flex>
              </Box>
            )
          ) : matterHistory ? (
            <Box
              p={6}
              bgColor={"gray.200"}
              borderRadius="md"
              shadow="md"
              w="100%"
              h="100%"
              display="flex"
              flexDirection="column"
            >
              <HStack mb={4}>
                <Button
                  padding={1}
                  onClick={() => setMatterHistory(null)}
                  size="sm"
                  color="gray.500"
                  variant="ghost"
                  _hover={{ color: "rgb(3, 14, 43)" }}
                >
                  <ArrowBackIcon boxSize={5} />
                </Button>

                <Text fontSize="xl" fontWeight="bold">
                  Matter History
                </Text>
              </HStack>

              <Box w="100%" flex="1">
                {matterHistory && matterHistory.length > 0 ? (
                  <Box className="chrono-wrapper" w="100%" h="100%">
                    <Chrono
                      items={matterHistory.map((history) => ({
                        title: history.MatterHistoryActionDate
                          ? new Date(
                              history.MatterHistoryActionDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A",
                        cardTitle: history.MatterHistoryActionName || "N/A",
                        cardSubtitle: history.MatterHistoryActionText || "",
                      }))}
                      mode="alternating"
                      theme={{
                        primary: "rgb(67, 103, 201)",
                        cardBgColor: "#ffffff",
                        cardTitleColor: "rgb(67, 103, 201)",
                        buttonBorderColor: "rgb(67, 103, 201)",
                        buttonHoverBorderColor: "rgb(67, 103, 201)",
                      }}
                      layout={{ cardHeight: "auto" }}
                      hideControls={true}
                      slideShow={false}
                      scrollable={{ enabled: true }}
                    />
                  </Box>
                ) : (
                  <Flex
                    flex="1"
                    direction="column"
                    align="center"
                    justify="center"
                    py={10}
                    px={4}
                    bg="gray.100"
                    borderRadius="md"
                    border="1px dashed"
                    borderColor="gray.300"
                    textAlign="center"
                    h="100%"
                  >
                    <Icon as={TimeIcon} w={8} h={8} color="gray.400" mb={2} />
                    <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                      No history available
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      This matter has no recorded history yet.
                    </Text>
                  </Flex>
                )}
              </Box>
            </Box>
          ) : pastSixMonOfMatters?.length > 0 ? (
            <VStack
              spacing={2}
              w={"100%"}
              flex="1"
              borderRadius="md"
              bgColor={"gray.200"}
              p={2}
              align={"stretch"}
              overflowY="auto"
            >
              {pastSixMonOfMatters.map((matter, idx) => (
                <Card
                  className="matter-card"
                  key={idx}
                  as="article"
                  p={4}
                  pr={5}
                  borderRadius="md"
                  bg="white"
                  boxShadow="sm"
                  _hover={{
                    boxShadow: "md",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  cursor="pointer"
                  position="relative"
                  flex={1}
                  onClick={() => handleGetMatterHistory(matter.MatterId)}
                >
                  {" "}
                  <ChakraTooltip
                    label="Add to watchlist"
                    fontSize="sm"
                    hasArrow
                    placement="top"
                  >
                    <Box
                      position="absolute"
                      top={1}
                      right={1}
                      className="add-to-history"
                      cursor={"pointer"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddMatterToWatchList(matter);
                      }}
                    >
                      <Icon
                        as={ClockPlus}
                        w={5}
                        h={5}
                        color="gray.400"
                        _hover={{ color: "gray.600" }}
                      />
                    </Box>
                  </ChakraTooltip>
                  <Heading
                    size="sm"
                    isTruncated
                    mb={1}
                    title={matter.MatterTitle}
                  >
                    {matter.MatterTitle}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    File: {matter.MatterFile}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Status: {matter.Status || "N/A"} | Committee:{" "}
                    {matter.Committee || "N/A"}
                  </Text>
                </Card>
              ))}
            </VStack>
          ) : (
            <Flex
              flex="1"
              direction="column"
              align="center"
              justify="center"
              py={10}
              px={4}
              bg="gray.50"
              borderRadius="md"
              border="1px dashed"
              borderColor="gray.300"
              textAlign="center"
            >
              <Icon as={InfoOutlineIcon} w={8} h={8} color="gray.400" mb={2} />
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                No matters found
              </Text>
              <Text fontSize="sm" color="gray.500">
                Try adjusting your filters or check back later.
              </Text>
            </Flex>
          )}
        </CardBody>
      </Card>
      <Card minW={"15rem"} minH="200px" maxW="100%">
        <CardHeader pb={4}>
          <Flex direction="column" gap={3}>
            <Heading size="md">Watchlist</Heading>
          </Flex>
        </CardHeader>
        <Divider w="90%" m="auto" borderColor="gray.200" borderWidth="1px" />
        <CardBody display="flex" flexDir="column" pt={4} overflowY="auto">
          {loadingWatchList ? (
            <Box
              flex="1"
              borderRadius="md"
              bgGradient="linear(to-r, #e2e8f0 0%, #f8fafc 50%, #e2e8f0 100%)"
              bgSize="200% 100%"
              animation={`${shimmer} 1.5s infinite`}
            />
          ) : (
            <Box
              p={2}
              bgColor={"gray.200"}
              borderRadius="md"
              shadow="md"
              w="100%"
              h="100%"
              display="flex"
              flexDirection="column"
            >
              <VStack spacing={2} align="start" w="100%">
                {watchlist.map((matter, idx) => (
                  <Card
                    className="watchlist-matter-card"
                    key={idx}
                    as="article"
                    p={2}
                    pr={5}
                    borderRadius="md"
                    bg="white"
                    boxShadow="sm"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-1px)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    cursor="pointer"
                    position="relative"
                    minH="4rem"
                    maxH="5rem"
                    w={{ base: "100%", md: "15rem" }}
                  >
                    <ChakraTooltip
                      label="Remove from watchlist"
                      fontSize="xs"
                      hasArrow
                      placement="top"
                    >
                      <Box
                        position="absolute"
                        top={1}
                        right={1}
                        className="remove-from-history"
                        cursor="pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWatchlist((prev) =>
                            prev.filter(
                              (item) => item.MatterId !== matter.MatterId
                            )
                          );
                          localStorage.setItem(
                            "watchlist",
                            JSON.stringify(
                              watchlist.filter(
                                (item) => item.MatterId !== matter.MatterId
                              )
                            )
                          );
                        }}
                      >
                        <Icon
                          as={Trash2}
                          w={4}
                          h={4}
                          color="gray.400"
                          _hover={{ color: "red.500" }}
                        />
                      </Box>
                    </ChakraTooltip>

                    <Heading
                      size="xs"
                      isTruncated
                      mb={0.5}
                      title={matter.MatterTitle}
                    >
                      {matter.MatterTitle}
                    </Heading>
                    <Text fontSize="xs" color="gray.600" isTruncated>
                      File: {matter.MatterFile}
                    </Text>
                    <Text fontSize="xs" color="gray.500" isTruncated>
                      Status: {matter.Status || "N/A"} | Committee:{" "}
                      {matter.Committee || "N/A"}
                    </Text>
                  </Card>
                ))}
              </VStack>
            </Box>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Dashboard;

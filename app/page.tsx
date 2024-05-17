"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Grid, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function Home() {
  const [randomPairs, setRandomPairs] = useState<number[]>([]);
  const [rotatedCards, setRotatedCards] = useState<boolean[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [add, setAdd] = useState(2);
  const [duration, setDuration] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateRandomPairs = (pairCount: number) => {
    const pairs = [];
    for (let i = 0; i < pairCount; i++) {
      const num = generateRandomNumber(1, 100);
      pairs.push(num, num);
    }
    return pairs;
  };

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleGeneratePairs = () => {
    const pairs = generateRandomPairs(add);
    setRandomPairs(shuffleArray(pairs));
    setRotatedCards(new Array(pairs.length).fill(false));
    setFlippedCards([]);
  };

  useEffect(() => {
    handleGeneratePairs();
  }, []);

  useEffect(() => {
    if (rotatedCards.every((card) => card)) {
      setAdd((prev) => prev + 1);
      setDuration((prev) => prev + 5);
      handleGeneratePairs();
    }
  }, [rotatedCards]);

  const handleClick = (index: number) => {
    if (flippedCards.length < 2 && !flippedCards.includes(index)) {
      const updatedRotatedCards = [...rotatedCards];
      updatedRotatedCards[index] = true;
      setRotatedCards(updatedRotatedCards);
      setFlippedCards([...flippedCards, index]);

      if (flippedCards.length === 1) {
        const [firstIndex] = flippedCards;
        if (randomPairs[firstIndex] !== randomPairs[index]) {
          setTimeout(() => {
            const resetRotatedCards = [...rotatedCards];
            resetRotatedCards[firstIndex] = false;
            resetRotatedCards[index] = false;
            setRotatedCards(resetRotatedCards);
            setFlippedCards([]);
          }, 1000);
        } else {
          setFlippedCards([]);
          setScore((prev) => prev + 1); // Increase score when a pair is matched
        }
      }
    }
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <Flex
      direction="column"
      justify="start"
      mih="100vh"
      bg="dark"
      style={{ border: "2px solid red" }}
    >
      <Flex direction={"row"} justify={"center"} p={40}>
        <CountdownCircleTimer
          key={duration}
          isPlaying
          duration={duration}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => {
            if (!rotatedCards.every((card) => card)) {
              setGameOver(true);
              return { shouldRepeat: false };
            }
          }}
        >
          {({ remainingTime }) => (
            <Text style={{ fontSize: "100px", color: "white" }}>
              {remainingTime}
            </Text>
          )}
        </CountdownCircleTimer>
      </Flex>
      <Flex direction="row" justify="center">
        {gameOver ? (
          <Text style={{ fontSize: "50px", color: "white" }}>Game Over</Text>
        ) : (
          <Grid gutter="sm" justify="center">
            {" "}
            {/* Add justify="center" here */}
            {randomPairs.map((num, index) => (
              <Box key={index} style={{ padding: "3px" }}>
                <motion.div
                  onClick={() => handleClick(index)}
                  initial={{ rotateY: -170 }}
                  animate={{ rotateY: rotatedCards[index] ? 0 : -170 }}
                  transition={{ duration: 0.2 }}
                >
                  <Grid.Col span={6} key={index}>
                    <Card
                      shadow="sm"
                      radius="md"
                      withBorder
                      h={150}
                      w={120}
                      style={{
                        fontSize: "30px",
                        justifyContent: "center",
                        alignContent: "center",
                        color: rotatedCards[index] ? "black" : "transparent",
                      }}
                    >
                      <Flex
                        direction="row"
                        justify="center"
                        onClick={() => handleClick(index)}
                      >
                        {rotatedCards[index] ? num : num}
                      </Flex>
                    </Card>
                  </Grid.Col>
                </motion.div>
              </Box>
            ))}
          </Grid>
        )}
      </Flex>

      {gameOver && (
        <Flex direction="row" justify="center" p={20}>
          <Button
            onClick={resetGame}
            style={{ fontSize: "30px", height: "100px" }}
          >
            Restart Game
          </Button>
        </Flex>
      )}
      <Flex direction="row" justify="center" p={20}>
        <Text style={{ fontSize: "30px", color: "white" }}>Score: {score}</Text>
      </Flex>
    </Flex>
  );
}

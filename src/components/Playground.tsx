import { useEffect, useState } from "react";
import "./Playground.css";
import GridItem from "../models/GridItem";
import SnakeBlock from "../models/SnakeBlock";
import FoodItem from "../models/FoodItem";

enum MovementDirection {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
}

const Playground = () => {
  const height = 500;
  const width = 500;
  const gridCount: number = 25;
  const gridItemSize = height / gridCount;

  const [gridItems, setGridItems] = useState<Array<GridItem>>([]);
  const [startGame, setStartGame] = useState(false);
  const [movementDirection, setMovementDirection] = useState<MovementDirection>(
    MovementDirection.RIGHT
  );
  const [score, setScore] = useState(0);

  //song
  // Replace with the actual path

  //food State
  const [foods, setFood] = useState<Array<FoodItem>>([
    {
      type: "apple",
      index: 0,
      position: {
        xIndex: Math.floor(Math.random() * 24),
        yIndex: Math.floor(Math.random() * 24),
      },
    },
    {
      type: "berry",
      index: 1,
      position: {
        xIndex: Math.floor(Math.random() * 24),
        yIndex: Math.floor(Math.random() * 24),
      },
    },
  ]);

  // Snakes
  const [snakes, setSnakes] = useState<Array<SnakeBlock>>([]);

  const snakeSizeHandler = (flag: boolean, lastFoodtype: string) => {
    const snakesCurrentValues: Array<SnakeBlock> = [];
    let previousLocation = {
      xIndex: snakes[0].position.xIndex,
      yIndex: snakes[0].position.yIndex,
    };

    snakes.forEach((item) => {
      // If it's not the first item, move it to new location and
      // set previousLocation to it's previous location
      const savedLocation = {
        xIndex: item.position.xIndex,
        yIndex: item.position.yIndex,
      };
      if (item.index !== 0) {
        item.position = previousLocation;
      }

      // Set previous location
      previousLocation = savedLocation;

      // Move First Item
      if (item.index === 0) {
        switch (movementDirection) {
          case MovementDirection.RIGHT:
            item.position.xIndex++;
            break;
          case MovementDirection.LEFT:
            item.position.xIndex--;
            break;
          case MovementDirection.UP:
            item.position.yIndex--;
            break;
          case MovementDirection.DOWN:
            item.position.yIndex++;
            break;
        }
      }

      // Game Over
      if (
        item.position.xIndex > 24 ||
        item.position.yIndex > 24 ||
        item.position.xIndex < 0 ||
        item.position.yIndex < 0
      ) {
        //  clearInterval(gameplayLoop);
        setStartGame(false);
      }
      snakesCurrentValues.push(item);
    });

    //increasing length
    if (flag && lastFoodtype === "apple") {
      const newSnakeBlock: SnakeBlock = {
        index: snakes.length, // Increment the index
        position: {
          xIndex: previousLocation.xIndex,
          yIndex: previousLocation.yIndex,
        },
      };

      snakesCurrentValues.push(newSnakeBlock);
    } else if (flag && lastFoodtype === "berry") {
      snakesCurrentValues.pop();
    }

    setSnakes(snakesCurrentValues);

    //handling if snake bumps into himself

    snakes.forEach((item) => {
      if (
        item.position.xIndex === snakes[0].position.xIndex &&
        item.index !== 0 &&
        item.position.yIndex === snakes[0].position.yIndex
      ) {
        setStartGame(false);
      }
    });
  };

  const movementHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "s") {
      if (movementDirection === MovementDirection.UP) return;
      setMovementDirection(MovementDirection.DOWN);
    } else if (event.key === "d") {
      if (movementDirection === MovementDirection.LEFT) return;
      setMovementDirection(MovementDirection.RIGHT);
    } else if (event.key === "a") {
      if (movementDirection === MovementDirection.RIGHT) return;
      setMovementDirection(MovementDirection.LEFT);
    } else if (event.key === "w") {
      if (movementDirection === MovementDirection.DOWN) return;
      setMovementDirection(MovementDirection.UP);
    }
  };

  useEffect(() => {
    // Clear existing grid and snake data
    setGridItems([]);

    if (snakes.length === 0) {
      setSnakes([
        {
          index: 0,
          position: {
            xIndex: 5,
            yIndex: 0,
          },
        },
        {
          index: 1,
          position: {
            xIndex: 4,
            yIndex: 0,
          },
        },
        {
          index: 2,
          position: {
            xIndex: 3,
            yIndex: 0,
          },
        },
        {
          index: 3,
          position: {
            xIndex: 2,
            yIndex: 0,
          },
        },
        {
          index: 4,
          position: {
            xIndex: 1,
            yIndex: 0,
          },
        },
        {
          index: 5,
          position: {
            xIndex: 0,
            yIndex: 0,
          },
        },
      ]);
    }

    // Generate Grid
    for (let x = 0; x < gridCount; x++) {
      for (let y = 0; y < gridCount; y++) {
        const grid: GridItem = {
          index: gridCount * x + y,
          position: {
            xIndex: x,
            yIndex: y,
          },
        };
        setGridItems((prev) => [...prev, grid]);
      }
    }

    //game play
    const gameplayLoop = setInterval(() => {
      if (!startGame) {
        return;
      }
      let foodCaptured = false;
      //food stuff
      const filteredFoods: Array<FoodItem> = [];

      foods.forEach((food) => {
        if (
          food.position.xIndex === snakes[0].position.xIndex &&
          food.position.yIndex === snakes[0].position.yIndex
        ) {
          // Remove Food
          if (food.type === "apple") {
            setScore((prev) => prev + 1);
          } else {
            setScore((prev) => prev + 2);
          }
          foodCaptured = true;
          snakeSizeHandler(true, food.type);

          console.log("Captured Food");
        } else {
          filteredFoods.push(food);
        }
      });

      if (filteredFoods.length === 1) {
        const foodDecider = Math.floor(Math.random() * 10);
        const newFood = {
          type: foodDecider === 5 ? "berry" : "apple",
          index: Math.random(),
          position: {
            xIndex: Math.floor(Math.random() * 24),
            yIndex: Math.floor(Math.random() * 24),
          },
        };

        filteredFoods.push(newFood);
      }
      setFood(filteredFoods);
      if (!foodCaptured) {
        snakeSizeHandler(false, "");
      }
    }, 120 - score * 2);

    // Clear Loops
    return () => clearInterval(gameplayLoop);
  }, [movementDirection, startGame, foods, snakes, score]);

  return (
    <div className="playgroundWrapper">
      <div className="scoreBoard">Score : {score}</div>
      <div
        className="playgroundContainer"
        tabIndex={0}
        onKeyDown={(event: React.KeyboardEvent<HTMLElement>) =>
          movementHandler(event)
        }
        onClick={() => setStartGame(true)}
      >
        {/* play */}
        <div style={{ width: width, height: height, position: "absolute" }}>
          {snakes.map((snake) => (
            <div
              key={snake.index}
              className="snakeBody"
              style={{
                top: snake.position.yIndex * gridItemSize,
                left: snake.position.xIndex * gridItemSize,
                width: gridItemSize,
                height: gridItemSize,
                position: "absolute",
                borderRadius: "5px",

                background: `repeating-linear-gradient(
                  to right,
                  #f6ba52,
                  #f6ba52 10px,
                  #ffd180 10px,
                  #ffd180 20px
                )`,
              }}
            ></div>
          ))}
        </div>
        {/* food */}

        <div style={{ width: width, height: height, position: "absolute" }}>
          {foods.map((fooditem) => (
            <div
              key={fooditem.index}
              style={{
                top: fooditem.position.yIndex * gridItemSize,
                left: fooditem.position.xIndex * gridItemSize,
                width: gridItemSize,
                height: gridItemSize,
                background: fooditem.type === "apple" ? "#DF2E38" : "#0C356A",
                position: "absolute",
                borderRadius: "10px",
              }}
            >
              {" "}
            </div>
          ))}
        </div>

        {/* grid */}
        <div style={{ width: width, height: height, position: "relative" }}>
          {gridItems.map((item) => (
            <div
              key={item.index}
              className="gridItem"
              style={{
                top: item.position.xIndex * gridItemSize,
                left: item.position.yIndex * gridItemSize,
                width: gridItemSize,
                height: gridItemSize,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playground;

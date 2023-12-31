import React, { useState, ChangeEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import styles from "./fibonacci-page.module.css";
import { DELAY_IN_MS } from "../../constants/delays";

export const FibonacciPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const [loader, setLoader] = useState<boolean>(false);
  const [circles, setCircles] = useState<Array<JSX.Element>>();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.valueAsNumber);
  };

  const onClick = () => {
    setLoader(true);
    const numbers = inputValue;
    setInputValue(undefined);
    if (numbers !== undefined) {
      getFibonacciRow(numbers).finally(() => setLoader(false));
    }
  };

  function getCircles(array: Array<number>) {
    setCircles(
      array.map((item, index) => {
        return <Circle letter={item.toString()} key={index} index={index} />;
      })
    );
  }

  async function refreshData(array: Array<number>) {
    getCircles(array);
    await new Promise((resolve) => setTimeout(resolve, DELAY_IN_MS));
  }

  async function getFibonacciRow(index: number) {
    let fibonacci = [1];
    await refreshData(fibonacci);
    for (let i = 1; i <= index; i++) {
      const secondNumber = i - 2 < 0 ? 0 : fibonacci[i - 2];
      fibonacci[i] = fibonacci[i - 1] + secondNumber;
      await refreshData(fibonacci);
    }
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className={styles.container}>
        <Input
          type="number"
          isLimitText={true}
          max={19}
          value={inputValue === undefined ? "" : inputValue}
          onChange={onChange}
        />
        <Button
          text="Развернуть"
          type="button"
          isLoader={loader}
          onClick={onClick}
          disabled={
            inputValue === undefined ||
            inputValue < 0 ||
            inputValue > 19 ||
            inputValue % 1 !== 0
          }
        />
      </div>
      <div className={styles[`circle-wrapper`]}>
        <div className={styles[`circle-container`]}>{circles}</div>
      </div>
    </SolutionLayout>
  );
};

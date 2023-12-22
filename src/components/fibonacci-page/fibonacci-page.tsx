import React, { useState, ChangeEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import styles from "./fibonacci-page.module.css";

export const FibonacciPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const [loader, setLoader] = useState<boolean>(false);
  const [circles, setCircles] = useState<Array<JSX.Element>>();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.valueAsNumber);
  };

  const onClick = () => {
    setLoader(true);
    // исправить название
    const c = inputValue
    setInputValue(undefined)
      // исправить название
    if (c !== undefined) {
      getFibonacciRow(c).finally(() =>  setLoader(false));
    }
  };

  function getCircles(item: Array<number>) {
    setCircles(
        // исправить название
      item.map((a, index) => {
        return <Circle letter={a.toString()} key={index} index={index} />;
      })
    );
  }

  // исправить название
  async function promiseFunc(item: Array<number>) {
    getCircles(item);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function getFibonacciRow(index: number) {
    let fibonacci = [1];
    await promiseFunc(fibonacci);
    for (let i = 1; i <= index; i++) {
      // поменять название
      const b = i - 2 < 0 ? 0 : fibonacci[i - 2];
      fibonacci[i] = fibonacci[i - 1] + b;
      await promiseFunc(fibonacci);
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
        ></Input>
        <Button
          text="Развернуть"
          type="button"
          isLoader={loader}
          onClick={onClick}
          disabled={inputValue === undefined || inputValue < 0 || inputValue > 19}
        />
      </div>
      <div className={styles[`circle-wrapper`]}><div className={styles[`circle-container`]}>{circles}</div></div>
    </SolutionLayout>
  );
};

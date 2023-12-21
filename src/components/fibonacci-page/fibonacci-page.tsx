import React, { useState, ChangeEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from "./fibonacci-page.module.css";

export const FibonacciPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<number>();
  const [loader, setLoader] = useState<boolean>(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.valueAsNumber);
  };

  const onClick = () => {};

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className={styles.container}>
        <Input
          type="number"
          isLimitText={true}
          max={19}
          value={inputValue}
          onChange={onChange}
        ></Input>
        <Button
          text="Развернуть"
          type="button"
          isLoader={loader}
          onClick={onClick}
          disabled={!inputValue || inputValue<0 || inputValue>19}
        />
      </div>
    </SolutionLayout>
  );
};

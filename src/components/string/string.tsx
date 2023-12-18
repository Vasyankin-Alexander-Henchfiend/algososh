import React, { useState, ChangeEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from "./string.module.css";

export const StringComponent: React.FC = () => {

  const [ inputValue, setInputValue ] = useState<string>()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <SolutionLayout title="Строка">
      <div className={styles.container}>
        <Input type="text" isLimitText={true} maxLength={11} value={inputValue} onChange={onChange}></Input>
        <Button text='Развернуть' type='button' isLoader={false}/>
      </div>
    </SolutionLayout>
  );
};

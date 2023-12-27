import React, { useMemo, useState, ChangeEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from './queue-page.module.css'

export const QueuePage: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addNumber = () => {

  }

  const deleteNumber = () => {

  }

  const clearAll = () => {

  }

  return (
    <SolutionLayout title="Очередь">
      <div className={styles[`main-wrapper`]}>
        <div className={styles[`second-wrapper`]}>
          <Input
            type="text"
            isLimitText={true}
            maxLength={4}
            value={inputValue}
            onChange={onChange}
          />
          <Button
            text="Добавить"
            type="button"
            isLoader={false}
            onClick={addNumber}
            disabled={inputValue === "" ? true : false}
          />
          <Button
            text="Удалить"
            type="button"
            isLoader={false}
            onClick={deleteNumber}
          />
        </div>
        <Button
          text="Очистить"
          type="button"
          isLoader={false}
          onClick={clearAll}
        />
      </div>
      <div className={styles[`circles-wrapper`]}></div>
    </SolutionLayout>
  );
};

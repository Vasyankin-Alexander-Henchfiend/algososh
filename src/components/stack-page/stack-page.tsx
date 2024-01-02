import React, { useRef, useState, ChangeEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import styles from "./stack-page.module.css";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

type TStack<T> = {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  size(): number;
  clear(): number;
};

class Stack<T> implements TStack<T> {
  storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  push(item: T) {
    if (this.size() === this.capacity) {
      throw Error("Stack has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }

  pop() {
    return this.storage.pop();
  }

  peek() {
    return this.storage[this.size() - 1];
  }

  size() {
    return this.storage.length;
  }

  clear() {
    return (this.storage.length = 0);
  }
}

export const StackPage: React.FC = () => {
  const stack = useRef(new Stack<string>());
  const [inputValue, setInputValue] = useState<string>("");
  const [circles, setCircles] = useState<Array<JSX.Element>>();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  function getCircles(isChecked: boolean = true) {
    return stack.current.storage.map((item, index: number) => {
      return (
        <Circle
          letter={item}
          key={index}
          index={index}
          head={stack.current.storage.length - 1 === index ? "top" : ""}
          state={
            stack.current.storage.length - 1 === index && isChecked
              ? ElementStates.Changing
              : ElementStates.Default
          }
        />
      );
    });
  }

  async function refreshCircles() {
    setCircles(getCircles());
    await new Promise((resolve) =>
      setTimeout(resolve, SHORT_DELAY_IN_MS)
    ).finally(() => setCircles(getCircles(false)));
  }

  const addNumber = async () => {
    stack.current.push(inputValue);
    setInputValue("");
    await refreshCircles();
  };

  const deleteNumber = async () => {
    setInputValue("");
    await refreshCircles();
    stack.current.pop();
    setCircles(getCircles(false));
  };

  const clearAll = () => {
    stack.current.clear();
    setInputValue("");
    setCircles([]);
  };

  return (
    <SolutionLayout title="Стек">
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
      <div className={styles[`circles-wrapper`]}>{circles}</div>
    </SolutionLayout>
  );
};

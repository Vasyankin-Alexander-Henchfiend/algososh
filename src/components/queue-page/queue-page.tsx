import React, { useMemo, useState, ChangeEvent, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./queue-page.module.css";

type TQueue<T> = {
  enqueue(item: T): void;
  dequeue: () => void;
  size(): number;
  clear: () => void;
};

class Queue<T> implements TQueue<T> {
  storage: (T | null)[] = [];
  private readonly queueSize: number = 0;
  private head: number = 0;
  private tail: number = 0;
  isFull = () => this.tail === this.queueSize - 1;

  constructor(size: number) {
    this.queueSize = size;
    this.storage = Array(size).fill(null);
  }

  enqueue(item: T): void {
    if (this.isFull()) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    if (this.storage[0] === null) {
      this.storage[0] = item;
    } else {
      this.tail++;
      this.storage[this.tail] = item;
    }
  }

  dequeue() {
    this.storage[this.head] = null;
    this.head++;
    if (this.head === this.size()) {
      this.head = this.size() - 1;
    }
  }

  getTail = (): number => {
    return this.tail;
  };

  getHead = (): number => {
    return this.head;
  };

  size(): number {
    return this.storage.length;
  }

  clear() {
    this.storage.fill(null);
    this.head = 0;
    this.tail = 0;
  }
}

export const QueuePage: React.FC = () => {
  const queue = useMemo(() => new Queue<string>(7), []);
  const [inputValue, setInputValue] = useState<string>("");
  const [circles, setCircles] = useState<Array<JSX.Element>>();
  const [ isAddBtnClick, setIsAddBtnClick ] = useState<boolean>(false)
  const [ isDelBtnClick, setIsDelBtnClick ] = useState<boolean>(false)

  useEffect(() => {
    setCircles(getCircles());
  }, []);

  function getCircles() {
    return queue.storage.map((item, index) => {
      return (
        <Circle
          letter={item === null ? "" : item}
          key={index}
          index={index}
          head={(index === queue.getHead() && item !== null) ||  (index === queue.getHead() && queue.getHead() === queue.size() - 1) ? "head" : ""}
          tail={index === queue.getTail() && item !== null ? "tail" : ""}
          state={
            (isAddBtnClick && queue.getTail() + 1 === index && item === null)
            // (index === queue.getHead() && item !== null && isDelBtnClick)
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
    ).finally(() => setCircles(getCircles()));
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addNumber = async () => {
    setIsAddBtnClick(true)
    await refreshCircles();
    queue.enqueue(inputValue);
    setInputValue("");
    setIsAddBtnClick(false)
    setCircles(getCircles());
  };

  const deleteNumber = async () => {
    setIsDelBtnClick(true)
    await refreshCircles();
    setInputValue("");
    queue.dequeue();
    setIsDelBtnClick(false)
    setCircles(getCircles());
  };

  const clearAll = () => {
    queue.clear();
    setCircles(getCircles());
    setInputValue("");
  };

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
            disabled={inputValue === ""}
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

import React, {
  useRef,
  useState,
  ChangeEvent,
  useEffect,
  useCallback,
} from "react";
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
  
  constructor(size: number) {
    this.queueSize = size;
    this.storage = Array(size).fill(null);
  }
  isFull = () => this.tail === this.queueSize - 1;

  enqueue(item: T): void {
    if (this.isFull()) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    if (this.storage[0] === null && this.tail === 0) {
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
  const queue = useRef(new Queue<string>(7));
  const [inputValue, setInputValue] = useState<string>("");
  const [circles, setCircles] = useState<Array<JSX.Element>>();
  const [isAddBtnClick, setIsAddBtnClick] = useState<boolean>(false);
  const [isDelBtnClick, setIsDelBtnClick] = useState<boolean>(false);

  const getCircles = useCallback(() => {
    setCircles(
      queue.current.storage.map((item, index) => {
        return (
          <Circle
            letter={item === null ? "" : item}
            key={index}
            index={index}
            head={
              (index === queue.current.getHead() && item !== null) ||
              (index === queue.current.getHead() &&
                queue.current.getHead() === queue.current.size() - 1)
                ? "head"
                : ""
            }
            tail={index === queue.current.getTail() && item !== null ? "tail" : ""}
            state={
              (isAddBtnClick &&
                (queue.current.storage[0] !== null || queue.current.getHead() > 0) &&
                queue.current.getTail() + 1 === index) ||
              (isAddBtnClick &&
                queue.current.getTail() === 0 &&
                index === 0 &&
                queue.current.storage[0] === null) ||
              (index === queue.current.getHead() && item !== null && isDelBtnClick)
                ? ElementStates.Changing
                : ElementStates.Default
            }
          />
        );
      })
    );
  }, [setCircles, queue, isAddBtnClick, isDelBtnClick]);

  useEffect(() => {
    getCircles();
  }, [getCircles]);

  async function refreshCircles() {
    getCircles();
    await new Promise((resolve) => setTimeout(resolve, SHORT_DELAY_IN_MS));
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addNumber = async () => {
    setInputValue("");
    setIsAddBtnClick(true);
    await refreshCircles();
    setIsAddBtnClick(false);
    queue.current.enqueue(inputValue);
  };

  const deleteNumber = async () => {
    setInputValue("");
    setIsDelBtnClick(true);
    await refreshCircles();
    queue.current.dequeue();
    setIsDelBtnClick(false);
  };

  const clearAll = () => {
    setInputValue("");
    queue.current.clear();
    getCircles();
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

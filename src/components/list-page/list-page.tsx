import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from "./list-page.module.css";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ArrowIcon } from "../ui/icons/arrow-icon";

class LinkedListNode<T> {
  value: T | null = null;
  next: LinkedListNode<T> | undefined = undefined;

  constructor(
    value: T | null = null,
    next: LinkedListNode<T> | undefined = undefined
  ) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList<T> {
  head: LinkedListNode<T> | undefined = undefined;
  tail: LinkedListNode<T> | undefined = undefined;
  constructor() {
    this.head = undefined;
    this.tail = undefined;
  }

  prepend(value: T) {
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
    return this;
  }

  append(value: T) {
    const newNode = new LinkedListNode(value);
    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
      return this;
    }
    this.tail.next = newNode;
    this.tail = newNode;
    return this;
  }

  delete(value: T) {
    if (!this.head) {
      return null;
    }

    let deletedNode = null;

    while (this.head && this.head.value === value) {
      deletedNode = this.head;

      this.head = this.head.next;
    }

    let currentNode = this.head;

    if (currentNode !== undefined) {
      while (currentNode.next) {
        if (currentNode.next.value === value) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    if (this.tail && this.tail.value === value) {
      this.tail = currentNode;
    }

    return deletedNode;
  }

  deleteTail() {
    if (!this.tail || !this.head) {
      return null;
    }

    const deletedTail = this.tail;

    if (this.head === this.tail) {
      this.head = undefined;
      this.tail = undefined;

      return deletedTail;
    }

    let currentNode = this.head;
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = undefined;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.tail = currentNode;

    return deletedTail;
  }

  deleteHead() {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = undefined;
      this.tail = undefined;
    }

    return deletedHead;
  }

  getHead() {
    return this.head?.value;
  }

  getTail() {
    return this.tail?.value;
  }

  toArray(): Array<T | null> {
    const nodes: Array<T | null> = [];

    let currentNode = this.head;

    while (currentNode) {
      nodes.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return nodes;
  }
}

type TListElement = {
  value: string | null;
  state: ElementStates;
  head: string | React.ReactElement | null;
  tail: string | React.ReactElement | null;
};

const defaultListElement: TListElement = {
  value: null,
  state: ElementStates.Default,
  head: null,
  tail: null,
};

const defaultNumbersArray = ["0", "34", "8", "1"];

export const ListPage: React.FC = () => {
  const linkedList = useRef(
    new LinkedList<TListElement>()
    // .append({ ...defaultListElement, value: "0", head: 'head' })
    // .append({ ...defaultListElement, value: "34" })
    // .append({ ...defaultListElement, value: "8" })
    // .append({ ...defaultListElement, value: "1", tail: 'tail' })
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [array, setArray] = useState<(TListElement | null)[]>();
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    addDefaultNumbers(defaultNumbersArray);
    setArray(linkedList.current.toArray());
  }, []);

  function addDefaultNumbers(arr: string[]) {
    arr.forEach((item) =>
      linkedList.current.append({ ...defaultListElement, value: item })
    );
    const linkedListHead = linkedList.current.getHead();
    if (linkedListHead) {
      linkedListHead.head = "head";
    }

    const linkedListTail = linkedList.current.getTail();
    if (linkedListTail) {
      linkedListTail.tail = "tail";
    }
  }

  const renderCircle = (
    item: TListElement,
    isSmall: boolean = false,
    index?: number
  ) => {
    return (
      <Circle
        letter={item?.value ?? ""}
        state={item?.state}
        head={""}
        tail={""}
        key={index}
        isSmall={isSmall}
      />
    );
  };

  async function refreshCircles() {
    setArray(linkedList.current.toArray());
    await new Promise((resolve) => setTimeout(resolve, SHORT_DELAY_IN_MS));
  }

  //добавляем голову
  const addHead = async () => {
    const initialHead = linkedList.current.getHead();
    const itemBeingAdded = {
      ...defaultListElement,
      value: inputValue,
      state: ElementStates.Changing,
    };
    setInputValue("");

    if (initialHead === undefined || initialHead === null) {
      itemBeingAdded.state = ElementStates.Default;
      linkedList.current.prepend(itemBeingAdded);
      setArray(linkedList.current.toArray());
      return;
    }

    initialHead.head = renderCircle(itemBeingAdded, true);
    await refreshCircles();
    initialHead.head = "";
    linkedList.current.prepend({
      ...itemBeingAdded,
      state: ElementStates.Modified,
      head: "head",
    });

    await refreshCircles();

    //получаем новый Head списка и меняем в нём цвет кружка на синий
    const newHead = linkedList.current.getHead();
    if (newHead) {
      newHead.state = ElementStates.Default;
      setArray(linkedList.current.toArray());
    }
  };

  //удаляем голову
  const deleteHead = async () => {
    const initialHead = linkedList.current.getHead();
    if (initialHead === undefined || initialHead === null) {
      return;
    }

    const removedItem = {
      ...initialHead,
      state: ElementStates.Changing,
    };
    initialHead.value = "";
    initialHead.tail = renderCircle(removedItem, true);
    await refreshCircles();

    linkedList.current.deleteHead();
    const newHead = linkedList.current.getHead();
    if (newHead) {
      newHead.head = "head";
    }
    await refreshCircles();
  };

  //добавляем хвост
  const addTail = async () => {
    const initialTail = linkedList.current.getTail();
    const itemBeingAdded = {
      ...defaultListElement,
      value: inputValue,
      state: ElementStates.Changing,
    };
    setInputValue("");

    if (initialTail === undefined || initialTail === null) {
      itemBeingAdded.state = ElementStates.Default;
      linkedList.current.append(itemBeingAdded);
      setArray(linkedList.current.toArray());
      return;
    }

    initialTail.head = renderCircle(itemBeingAdded, true);
    await refreshCircles();

    initialTail.tail = "";
    initialTail.head = '';
    linkedList.current.append({
      ...itemBeingAdded,
      state: ElementStates.Modified,
      tail: "tail",
    });
    await refreshCircles();

    //получаем новый Tail списка и меняем в нём цвет кружка на синий
    const newTail = linkedList.current.getTail();
    if (newTail) {
      newTail.state = ElementStates.Default;
      setArray(linkedList.current.toArray());
    }
  };

  //Удаляем хвост
  const deleteTail = async () => {
    const initialTail = linkedList.current.getTail();
    if (initialTail === undefined || initialTail === null) {
      return;
    }

    const removedItem = {
      ...initialTail,
      state: ElementStates.Changing,
    }
    initialTail.value = '';
    initialTail.tail = renderCircle(removedItem, true);
    await refreshCircles();

    linkedList.current.deleteTail();
    const newTail = linkedList.current.getTail();
    if (newTail) {
      newTail.tail = "tail";
    }
    await refreshCircles();
  };

  return (
    <SolutionLayout title="Связный список">
      <div className={styles[`button-wrapper`]}>
        <Input
          type="text"
          isLimitText={true}
          maxLength={4}
          value={inputValue}
          onChange={onChange}
        />
        <Button
          text="Добавить в head"
          type="button"
          isLoader={false}
          onClick={addHead}
        />
        <Button
          text="Добавить в tail"
          type="button"
          isLoader={false}
          onClick={addTail}
        />
        <Button
          text="Удалить из head"
          type="button"
          isLoader={false}
          onClick={deleteHead}
        />
        <Button
          text="Удалить из tail"
          type="button"
          isLoader={false}
          onClick={deleteTail}
        />
      </div>
      <div className={styles[`circles`]}>
        {array?.map((item, index) => (
          <div className={styles[`circle-wrapper`]}>
            <Circle
              letter={item?.value ?? ""}
              state={item?.state}
              head={item?.head}
              tail={item?.tail}
              index={index}
              key={index}
            />
            {index < array.length - 1 ? <ArrowIcon key={index + 1000} /> : null}
          </div>
        ))}
      </div>
    </SolutionLayout>
  );
};

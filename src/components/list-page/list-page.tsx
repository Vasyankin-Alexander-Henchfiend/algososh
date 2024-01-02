import React, {
  useState,
  ChangeEvent,
  useRef,
  useEffect,
  MouseEvent,
} from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from "./list-page.module.css";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { TCurrentButton, TListElement } from "./list-page.types";

class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | undefined = undefined;

  constructor(value: T, next: LinkedListNode<T> | undefined = undefined) {
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

  toArray(): Array<T> {
    const nodes: Array<T> = [];

    let currentNode = this.head;

    while (currentNode) {
      nodes.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  getByIndex(index: number | undefined) {
    let counter = 0;

    if (index !== undefined) {
      if (index >= this.toArray().length || index < 0) {
        return null;
      }

      let current = this.head;

      while (counter < index) {
        if (current) {
          current = current.next;
          counter++;
        }
      }
      return current;
    }
  }

  addByIndex(index: number | undefined, value: T) {
    if (index === 0) {
      this.prepend(value);
    }

    if (index !== undefined) {
      if (index > this.toArray().length || index < 0) {
        return null;
      }

      const prevNode = this.getByIndex(index - 1);
      const nextNode = this.getByIndex(index);

      if (prevNode && nextNode) {
        prevNode.next = new LinkedListNode(value, nextNode);
      }
    }
    return this;
  }

  deleteByIndex(index: number | undefined) {
    if (index === 0) {
      this.deleteHead();
    }

    if (index === this.toArray().length - 1 && index !== 0) {
      this.deleteTail();
    }

    if (index !== undefined) {
      if (index > this.toArray().length || index < 0) {
        return null;
      }

      const prevNode = this.getByIndex(index - 1);
      const nextNode = this.getByIndex(index + 1);

      if (prevNode && nextNode) {
        prevNode.next = nextNode;
      }
    }
    return this;
  }
}

const defaultListElement: TListElement = {
  value: null,
  state: ElementStates.Default,
  head: null,
  tail: null,
};

const defaultNumbersArray = ["0", "34", "8", "1"];

export const ListPage: React.FC = () => {
  const linkedList = useRef(new LinkedList<TListElement>());
  const [inputNumberValue, setInputNumberValue] = useState<string>("");
  const [inputIndexValue, setInputIndexValue] = useState<number | undefined>(
    undefined
  );
  const [array, setArray] = useState<(TListElement | null)[]>();
  const [currentButton, setCurrentButton] = useState<TCurrentButton>(null);

  const onNumberInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputNumberValue(event.target.value);
  };

  const onIndexInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputIndexValue(event.target.valueAsNumber);
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

  const renderSmallCircle = (
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
  const addHead = async (evt: MouseEvent<HTMLButtonElement>) => {
    setCurrentButton(evt.currentTarget.value as TCurrentButton);

    const initialHead = linkedList.current.getHead();
    const itemBeingAdded = {
      ...defaultListElement,
      value: inputNumberValue,
      state: ElementStates.Changing,
    };
    setInputNumberValue("");

    if (linkedList.current.toArray().length === 0) {
      linkedList.current.prepend({
        ...itemBeingAdded,
        state: ElementStates.Modified,
        head: "head",
        tail: "tail",
      });
    } else {
      if (initialHead === undefined || initialHead === null) {
        itemBeingAdded.state = ElementStates.Default;
        linkedList.current.prepend(itemBeingAdded);
        setArray(linkedList.current.toArray());
        return;
      }

      initialHead.head = renderSmallCircle(itemBeingAdded, true);
      await refreshCircles();
      initialHead.head = "";
      linkedList.current.prepend({
        ...itemBeingAdded,
        state: ElementStates.Modified,
        head: "head",
      });
    }

    await refreshCircles();

    //получаем новый Head списка и меняем в нём цвет кружка на синий
    const newHead = linkedList.current.getHead();
    if (newHead) {
      newHead.state = ElementStates.Default;
      setArray(linkedList.current.toArray());
    }
    setCurrentButton(null);
  };

  //удаляем голову
  const deleteHead = async (evt: MouseEvent<HTMLButtonElement>) => {
    setCurrentButton(evt.currentTarget.value as TCurrentButton);

    const initialHead = linkedList.current.getHead();
    if (initialHead === undefined || initialHead === null) {
      return;
    }

    const removedItem = {
      ...initialHead,
      state: ElementStates.Changing,
    };
    initialHead.value = "";
    initialHead.tail = renderSmallCircle(removedItem, true);
    await refreshCircles();

    linkedList.current.deleteHead();
    const newHead = linkedList.current.getHead();
    if (newHead) {
      newHead.head = "head";
    }
    await refreshCircles();
    setCurrentButton(null);
  };

  //добавляем хвост
  const addTail = async (evt: MouseEvent<HTMLButtonElement>) => {
    setCurrentButton(evt.currentTarget.value as TCurrentButton);

    const initialTail = linkedList.current.getTail();
    const itemBeingAdded = {
      ...defaultListElement,
      value: inputNumberValue,
      state: ElementStates.Changing,
    };
    setInputNumberValue("");

    if (linkedList.current.toArray().length === 0) {
      linkedList.current.prepend({
        ...itemBeingAdded,
        state: ElementStates.Modified,
        head: "head",
        tail: "tail",
      });
    } else {
      if (initialTail === undefined || initialTail === null) {
        itemBeingAdded.state = ElementStates.Default;
        linkedList.current.append(itemBeingAdded);
        setArray(linkedList.current.toArray());
        return;
      }

      initialTail.head = renderSmallCircle(itemBeingAdded, true);
      await refreshCircles();

      initialTail.tail = "";
      initialTail.head = "";
      linkedList.current.append({
        ...itemBeingAdded,
        state: ElementStates.Modified,
        tail: "tail",
      });
    }

    await refreshCircles();

    //получаем новый Tail списка и меняем в нём цвет кружка на синий
    const newTail = linkedList.current.getTail();
    if (newTail) {
      newTail.state = ElementStates.Default;
      setArray(linkedList.current.toArray());
    }
    setCurrentButton(null);
  };

  //Удаляем хвост
  const deleteTail = async (evt: MouseEvent<HTMLButtonElement>) => {
    setCurrentButton(evt.currentTarget.value as TCurrentButton);

    const initialTail = linkedList.current.getTail();
    if (initialTail === undefined || initialTail === null) {
      return;
    }

    const removedItem = {
      ...initialTail,
      state: ElementStates.Changing,
    };
    initialTail.value = "";
    initialTail.tail = renderSmallCircle(removedItem, true);
    await refreshCircles();

    linkedList.current.deleteTail();
    const newTail = linkedList.current.getTail();
    if (newTail) {
      newTail.tail = "tail";
    }
    await refreshCircles();
    setCurrentButton(null);
  };

  //добавить по индексу
  const addByIndex = async (evt: MouseEvent<HTMLButtonElement>) => {
    setCurrentButton(evt.currentTarget.value as TCurrentButton);
    let initialItem = {
      ...defaultListElement,
      value: inputNumberValue,
      state: ElementStates.Changing,
    };
    if (inputIndexValue !== undefined) {
      for (let i = 0; i <= inputIndexValue; i++) {
        if (i === 0) {
          await refreshCircles();
          linkedList.current.toArray()[i].head = renderSmallCircle(
            initialItem,
            true
          );
          await refreshCircles();
        }
        if (i > 0) {
          await refreshCircles();
          linkedList.current.toArray()[i - 1].state = ElementStates.Changing;
          if (i - 1 === 0) {
            linkedList.current.toArray()[0].head = "head";
          } else {
            linkedList.current.toArray()[i - 1].head = "";
          }
          linkedList.current.toArray()[i].head = renderSmallCircle(
            initialItem,
            true
          );
          await refreshCircles();
        }
      }
      for (let i = 0; i <= inputIndexValue; i++) {
        linkedList.current.toArray()[i].state = ElementStates.Default;
      }
      linkedList.current.toArray()[inputIndexValue].head = "";
    }

    if (inputIndexValue === 0) {
      initialItem = {
        ...initialItem,
        head: "head",
      };
    }
    linkedList.current.addByIndex(inputIndexValue, {
      ...initialItem,
      state: ElementStates.Modified,
    });
    setInputNumberValue("");
    setInputIndexValue(undefined);
    await refreshCircles();

    const newElement = linkedList.current.getByIndex(inputIndexValue)?.value;
    if (newElement) {
      newElement.state = ElementStates.Default;
    }
    await refreshCircles();
    setCurrentButton(null);
  };

  //удалить по индексу
  const deleteByIndex = async (evt: MouseEvent<HTMLButtonElement>) => {
    setCurrentButton(evt.currentTarget.value as TCurrentButton);
    if (inputIndexValue !== undefined) {
      for (let i = 0; i <= inputIndexValue; i++) {
        await refreshCircles();
        linkedList.current.toArray()[i].state = ElementStates.Changing;
        await refreshCircles();
      }
    }

    const initialItem = linkedList.current.getByIndex(inputIndexValue)?.value;
    if (initialItem === undefined || initialItem === null) {
      return;
    }

    const removedValue = { ...initialItem, state: ElementStates.Changing };
    initialItem.value = "";
    initialItem.state = ElementStates.Default;
    initialItem.tail = renderSmallCircle(removedValue, true);
    await refreshCircles();

    linkedList.current.deleteByIndex(inputIndexValue);

    if (inputIndexValue !== undefined) {
      for (let i = 0; i < inputIndexValue; i++) {
        linkedList.current.toArray()[i].state = ElementStates.Default;
      }
    }
    setInputIndexValue(undefined);
    if (linkedList.current.toArray().length > 0) {
      if (inputIndexValue === linkedList.current.toArray().length) {
        linkedList.current.toArray()[
          linkedList.current.toArray().length - 1
        ].tail = "tail";
      }
      if (inputIndexValue === 0) {
        linkedList.current.toArray()[0].head = "head";
      }
    }
    await refreshCircles();
    setCurrentButton(null);
  };

  return (
    <SolutionLayout title="Связный список">
      <div className={styles[`controls-container`]}>
        <div className={styles[`button-wrapper`]}>
          <Input
            type="text"
            placeholder="введите значение"
            isLimitText={true}
            maxLength={4}
            value={inputNumberValue}
            onChange={onNumberInputChange}
            extraClass={styles.input}
          />
          <Button
            text="Добавить в head"
            type="button"
            value={"Добавить в head"}
            isLoader={currentButton === "Добавить в head"}
            onClick={addHead}
            disabled={!currentButton ? false : true}
          />
          <Button
            text="Добавить в tail"
            type="button"
            value={"Добавить в tail"}
            isLoader={currentButton === "Добавить в tail"}
            onClick={addTail}
            disabled={!currentButton ? false : true}
          />
          <Button
            text="Удалить из head"
            type="button"
            value={"Удалить из head"}
            isLoader={currentButton === "Удалить из head"}
            onClick={deleteHead}
            disabled={!currentButton ? false : true}
          />
          <Button
            text="Удалить из tail"
            type="button"
            value={"Удалить из tail"}
            isLoader={currentButton === "Удалить из tail"}
            onClick={deleteTail}
            disabled={!currentButton ? false : true}
          />
        </div>
        <div className={styles[`button-wrapper`]}>
          <Input
            type="number"
            placeholder="введите индекс"
            max={linkedList.current.toArray().length - 1}
            value={inputIndexValue === undefined ? "" : inputIndexValue}
            onChange={onIndexInputChange}
            extraClass={styles.input}
          />
          <Button
            text="Добавить по индексу"
            type="button"
            isLoader={currentButton === "Добавить по индексу"}
            value={"Добавить по индексу"}
            onClick={addByIndex}
            linkedList="big"
            disabled={!currentButton ? false : true}
          />
          <Button
            text="Удалить по индексу"
            type="button"
            isLoader={currentButton === "Удалить по индексу"}
            value={"Удалить по индексу"}
            onClick={deleteByIndex}
            linkedList="big"
            disabled={!currentButton ? false : true}
          />
        </div>
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

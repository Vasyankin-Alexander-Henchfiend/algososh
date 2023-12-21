import React, { useState, ChangeEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import styles from "./string.module.css";
import { ElementStates } from "../../types/element-states";

type TString = {
  state: ElementStates,
  value: string
}

export const StringComponent: React.FC = () => {

  const [ inputValue, setInputValue ] = useState<string>('')
  // массив который мы создали из строки
  const [ array, setArray ] = useState<Array<JSX.Element>>()
  // стейт для лоадера
  const [ loader, setLoader ] = useState<boolean>(false)
  

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }
  
  function takeArray(item: Array<TString>) {
    setArray(item.map((a) => {
      return <Circle letter={a.value} state={a.state}/>
    }))
  }
  
  const onClick = () => {
    setLoader(true)
    const string = Array.from(inputValue).map((item) => {return {value: item, state: ElementStates.Default} as TString})
    takeArray(string)
    sortArray(string).finally(() => {
      setLoader(false)
    })
  }
  
  async function promiseFunc(array: Array<TString>) {
    takeArray(array)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async function sortArray(array: Array<TString>) {
    let start = 0;
    let end = array?.length - 1;
    while(start <= end) {
      const startValue: TString = array[start];
      const endValue: TString = array[end];

      startValue.state = ElementStates.Changing;
      endValue.state = ElementStates.Changing;
      await promiseFunc(array)
      array[start] = endValue;
      array[end] = startValue;
      startValue.state = ElementStates.Modified;
      endValue.state = ElementStates.Modified;
      start ++
      end --
    }
    await promiseFunc(array)
  }

  return (
    <SolutionLayout title="Строка">
      <div className={styles.container}>
        <Input type="text" isLimitText={true} maxLength={11} value={inputValue} onChange={onChange}></Input>
        <Button text='Развернуть' type='button' isLoader={loader} onClick={onClick} />
      </div>
      <div className={styles[`circle-wrapper`]}>
      {array}
      </div>
    </SolutionLayout>
  );
};

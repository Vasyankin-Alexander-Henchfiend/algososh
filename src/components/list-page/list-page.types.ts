import { ElementStates } from "../../types/element-states";

export type TCurrentButton =
  | null
  | "Добавить по индексу"
  | "Удалить по индексу"
  | "Добавить в head"
  | "Добавить в tail"
  | "Удалить из head"
  | "Удалить из tail";

export type TListElement = {
  value: string | null;
  state: ElementStates;
  head: string | React.ReactElement | null;
  tail: string | React.ReactElement | null;
};

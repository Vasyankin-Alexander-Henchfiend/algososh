import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";

export type TColumnElement = {
  value: number;
  state: ElementStates;
};

export type TCurrentButton = null | Direction.Ascending | Direction.Descending;

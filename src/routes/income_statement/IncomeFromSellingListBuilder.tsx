import {ReactElement} from "react";

export interface IncomeFromSellingData {
  title: string | ReactElement;
  valuesForRow: { year: number; value: string | number | ReactElement}[];
}

export const INCOME_FROM_SELLING_LIST: IncomeFromSellingData[] = [
  {
    title: <b>Müügitulu</b>,
    valuesForRow: [],
  },
  {
    title: <>Müüdud <b>ühikuid</b></>,
    valuesForRow: []
  },
  {
    title: <>Ühe ühiku <b>keskmine</b> müügihind</>,
    valuesForRow: []
  },
  {
    title: "Müüdud ekspordiks",
    valuesForRow: []
  },
  {
    title: "Müüdud ekspordiks",
    valuesForRow: []
  },
  {
    title: "Muud äritulud (renditulu, intressitulu jne.)",
    valuesForRow: []
  },
  {
    title: <b>TULUD KOKKU</b>,
    valuesForRow: []
  }
];

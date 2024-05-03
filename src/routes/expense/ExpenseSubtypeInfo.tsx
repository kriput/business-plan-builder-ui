import { FinancialOperationSubtype } from "../../enums/FinancialOperationSubtype";
import { JSX } from "react";

export const FINANCIAL_OPERATION_SUBTYPE_INFO = new Map<
  FinancialOperationSubtype,
  JSX.Element
>([
  [
    FinancialOperationSubtype.RAW_MATERIALS,
    <>
      <div>
        Kulu kaubale või materjalile, mis on vajalik kõikide toodete
        valmistamiseks.
      </div>
      <br />
      <div>
        Andmed on arvutatud toodete müügiinfo põhjal:{" "}
        <b>Materjali / kauba kulu ühikule</b>
      </div>
    </>,
  ],
]);

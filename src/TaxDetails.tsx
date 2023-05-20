import _ from "lodash";
import { Income } from "./types";
import { copyToClipboard } from "./utils";

const PERCENT_TAX = 5;

const taxFor = (sum: number) => Number(((PERCENT_TAX * sum) / 100).toFixed(2));
const sumOf = (incomes: Income[]) =>
  Number(
    incomes
      .map((it) => it.uah)
      .reduce((acc, it) => acc + it, 0)
      .toFixed(2)
  );

type Props = {
  incomes: Income[];
};

export default function TaxDetails({ incomes }: Props) {
  const sum = sumOf(incomes);
  const tax = taxFor(sum);

  if (sum === 0) {
    return <></>;
  }
  return (
    <>
      <div className="flex justify-center flex-col text-base border-t-[1px]">
        <div className="flex justify-between">
          <span>Sum to declare</span>
          <span className="cursor-pointer" onClick={copyToClipboard(sum)}>{sum}₴</span>
        </div>
        <div className="flex justify-between">
          <span>Tax to pay</span>
          <span className="cursor-pointer" onClick={copyToClipboard(tax)}>
            {sum}₴ / 5% = {tax}₴
          </span>
        </div>
      </div>
    </>
  );
}

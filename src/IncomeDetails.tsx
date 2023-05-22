import Incomes from "./Incomes";
import TaxDetails from "./TaxDetails";
import { Income } from "./types";

type Props = {
  incomes: Income[];
  removeById: (id: string) => void | any;
};

export default function IncomeDetails({ incomes, removeById }: Props) {
  return (
    <section className="flex flex-col grow justify-between divide-solid">
      <Incomes incomes={incomes} removeById={removeById} />
      <TaxDetails incomes={incomes} />
    </section>
  );
}

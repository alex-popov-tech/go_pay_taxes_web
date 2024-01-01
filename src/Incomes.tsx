import { Income as IncomeType } from "./types";
import Income from "./Income";
import { prettyPrint, sumOf } from "./utils";

type Props = {
  incomes: IncomeType[];
  removeById: (id: string) => void | any;
};

export default function Incomes({ removeById, incomes }: Props) {
  if (!incomes.length) {
    return (
      <>
        <div className="h-auto md:w-128 hidden md:flex justify-center items-center">
          <span className="text-lg md:text-4xl text-[#888888]">
            ⇦ Add some incomes first
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="w-full md:w-128 flex flex-col">
        <div className="grid grid-cols-[repeat(3,1fr)_1rem] md:grid-cols-[2fr_repeat(3,1fr)_2fr_1rem] justify-items-start md:justify-items-start gap-x-4 text-sm md:text-base text-[#444444]">
          <span className="hidden md:inline font-semibold">Date</span>
          <span className="hidden md:inline font-semibold">Rate</span>
          <span className="font-semibold">Currency</span>
          <span className="font-semibold">UAH</span>
          <span className="font-semibold">Tax</span>
          <span></span>
          {incomes.map((income) => (
            <Income income={income} remove={() => removeById(income.id)} />
          ))}
        </div>
        <div className="grid grid-cols-[repeat(3,1fr)_1rem] md:grid-cols-[90px_5rem_repeat(3,1fr)_1rem] md:justify-items-end gap-x-2 text-sm md:text-base border-t-2">
          <span className="col-span-1 md:col-span-3"></span>
          <span className="font-bold whitespace-nowrap">
            {prettyPrint(sumOf(incomes, (it) => it.uah))}₴
          </span>
          <span className="font-bold whitespace-nowrap">
            {prettyPrint(sumOf(incomes, (it) => it.tax))}₴
          </span>
        </div>
      </section>
    </>
  );
}

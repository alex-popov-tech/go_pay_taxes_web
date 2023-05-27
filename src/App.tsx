import { useEffect, useState } from "react";
import AddIncomeForm from "./AddIncomeForm";
import { Income, IncomeDTO } from "./types";
import _ from "lodash";
import Incomes from "./Incomes";

function Note() {
  return (
    <div className="w-full flex flex-col text-center text-xs text-gray-400">
      <p>
        This app uses{" "}
        <a
          className="underline"
          href="https://bank.gov.ua/ua/open-data/api-dev"
        >
          official nbu api
        </a>{" "}
        for getting currency rates for a specific dates.
      </p>
      <p>
        If something is not working as intended, please open an{" "}
        <a
          className="underline"
          href="https://github.com/alex-popov-tech/go_pay_taxes_web/issues"
        >
          issue
        </a>{" "}
        on Github.
      </p>
    </div>
  );
}

export default function App() {
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    console.log(incomes);
  }, [incomes]);

  const addNewIncome = (newIncomes: IncomeDTO[]) =>
    setIncomes([
      ...incomes,
      ...newIncomes.map((it) => ({
        ...it,
        id: _.uniqueId(),
      })),
    ]);
  const removeById = (id: string) =>
    setIncomes(incomes.filter((it) => it.id !== id));
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <main className="h-fit w-4/5 md:w-fit p-3 bg-[#FDFDFD] rounded-lg">
          <h1 className="text-center text-4xl">Go pay taxes!</h1>
          <section className="w-auto my-3 flex flex-wrap max-md:flex-col max-md:items-center gap-5">
            <AddIncomeForm onSubmit={addNewIncome} />
            <Incomes incomes={incomes} removeById={removeById} />
          </section>
          <Note />
        </main>
      </div>
    </>
  );
}

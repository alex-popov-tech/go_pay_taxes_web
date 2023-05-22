import { useState } from "react";
import AddIncomeForm from "./AddIncomeForm";
import { Income, IncomeDTO } from "./types";
import _ from "lodash";
import IncomeDetails from "./IncomeDetails";

function Footer() {
  return (
    <p className="text-xs text-center text-gray-400">
      This app uses{" "}
      <a className="underline" href="https://bank.gov.ua/ua/open-data/api-dev">
        official nbu api
      </a>{" "}
      for getting currency rates for a specific dates. If something is not
      working as intended, please open an{" "}
      <a
        className="underline"
        href="https://github.com/alex-popov-tech/go_pay_taxes_web/issues"
      >
        issue
      </a>{" "}
      on Github.
    </p>
  );
}

export default function App() {
  const [incomes, setIncomes] = useState<Income[]>([]);

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
        <main className="h-fit w-72 sm:w-160 p-3 bg-[#FDFDFD] rounded-lg">
          <h1 className="text-center text-3xl sm:text-4xl">Go pay taxes!</h1>
          <section className="my-3 flex flex-wrap gap-3 sm:gap-5">
            <AddIncomeForm onSubmit={addNewIncome} />
            <IncomeDetails incomes={incomes} removeById={removeById} />
          </section>
          <Footer />
        </main>
      </div>
    </>
  );
}
